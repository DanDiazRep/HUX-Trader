const { MongoClient } = require("mongodb");
const cors = require('cors');
const express = require('express')
const multer = require('multer')
var axios = require('axios')
var FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

const app = express()
const port = 3030
app.use(express.json())

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.rykoqfm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

var whitelist = ['http://localhost:3000', 'https://localhost:3000']; //white list consumers
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  optionsSuccessStatus: 200,
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};
app.use(cors(corsOptions));

app.post('/item', multer({limits: {fileSize: 5 * 1024 * 1024}}).single('image'), async (req, res) => {
    if(req.file){
        const base64Data = req.file.buffer.toString('base64')
        
        let data = new FormData();
        data.append('key', process.env.IMAGE_HOSTING_API_KEY);
        data.append('action', 'upload');
        data.append('source', base64Data)

        let config = {
            method: 'post',
            url: 'https://freeimage.host/api/1/upload',
            headers: { 
                ...data.getHeaders()
            },
            data: data
        };
    
        axios(config)
        .then(async function(response) {
            let url = response.data.image.image.url
            let id = uuidv4()
            await addItemToUser(req.body.id, req.body.email, id, url, req.body.name, req.body.description)
            res.send({
                id,
                url,
                name: req.body.name,
                description: req.body.description
            })
        })
        .catch(function(error) {
            res.send(500)
        });
    } else{
        res.sendStatus(400)
    }
})

app.patch('/item', multer({limits: {fileSize: 5 * 1024 * 1024}}).single('image'), async (req, res) => {
    let id = req.body.id
    let itemId = req.body.itemId
    let itemName = req.body.itemName
    let itemDescription = req.body.itemDescription

    let result = await editItem(id, itemId, itemName, itemDescription)

    if(result.acknowledged && result.matchedCount){
        res.sendStatus(200)
    } else{
        res.sendStatus(500)
    }
})

app.patch('/delete', multer({limits: {fileSize: 5 * 1024 * 1024}}).single('image'), async (req, res) => {
    const database = client.db('trader');
    const users = database.collection('users');

    let userId = req.body.userId;
    let itemId = req.body.itemId;

    const result = users.updateOne(
        { userId: userId }, 
        {
            $pull: { "items": { "id":  itemId } } 
        });

    if(result){
        res.sendStatus(200)
    } else{
        res.sendStatus(500)
    }
})

app.get('/items/:id/:selectedItemId/:currentItemId?/:lastItemId?', async (req, res) => {
    let id = req.params.id
    let selectedItemId = req.params.selectedItemId
    try {
        const database = client.db('trader');
        const users = database.collection('users');
        const user = await users.findOne({userId: id})

        let likes = user.items.filter((item) => item.id === selectedItemId)[0].likes
        let dislikes = user.items.filter((item) => item.id === selectedItemId)[0].dislikes
        let matches = []
        if(user.items.filter((item) => item.id === selectedItemId)[0].matches) matches = user.items.filter((item) => item.id === selectedItemId)[0].matches.map((item) => {return item.itemId})
        if(!likes) likes = []
        if(!dislikes) dislikes = []

        let blacklist = likes.concat(dislikes, matches)
        if(req.params.currentItemId) blacklist.push(req.params.currentItemId)
        if(req.params.lastItemId) blacklist.push(req.params.lastItemId)

        const result = users.aggregate([
            {
              '$unwind': {
                'path': '$items'
              }
            }, {
              '$match': {
                '$and': [
                  {
                    'userId': {
                      '$ne': req.params.id
                    }
                  }, {
                    'items.id': {
                      '$nin': blacklist
                    }
                  }
                ]
              }
            }, {
              '$sample': {
                'size': 3
              }
            }, {
                '$project': {
                    "items.dislikes": 0,
                    "items.likes": 0,
                    "items.matches": 0
                }
            }
          ])
        let items = []
        for await (const doc of result) {
            if(!blacklist.includes(doc.items.id)){
                items.push({id: doc._id, userId: doc.userId, email: doc.email, items: [doc.items]});
                blacklist.push(doc.items.id)
            }
        }
        res.send(items)
    } catch (e) {
        return e
    }
})

app.get('/user/:id', async (req, res) => {
    let id = req.params.id
    let user = await getUser(id)
    if(user){
        res.send(user)
    } else{
        res.sendStatus(404)
    }
})

app.post('/swipe', multer({limits: {fileSize: 5 * 1024 * 1024}}).single('image'), async (req, res) => {
    const database = client.db('trader');
    const users = database.collection('users');

    let idA = req.body.userA
    let itemA = req.body.itemA
    let idB = req.body.userB
    let itemB = req.body.itemB
    let direction = req.body.direction

    const userB = await users.findOne({userId: idB})
    let likes = userB.items.filter((item) => item.id === itemB)[0].likes
    let dislikes = userB.items.filter((item) => item.id === itemB)[0].dislikes
    if(!likes) likes = []
    if(!dislikes) dislikes = []

    if(direction == 'right'){
        //Check if B likes A

        //B doesn't -> Add B to A.likes
        if(!likes.includes(itemA) && !dislikes.includes(itemA)){
            await users.updateOne({userId: idA, "items.id": itemA}, {$addToSet: {"items.$.likes": itemB}}, {upsert: true});
            res.sendStatus(200)
        }
        //B does -> Add each other to matches and remove from likes array
        if(likes.includes(itemA)){
            await users.updateOne({userId: idA, "items.id": itemA}, {$addToSet: {"items.$.matches": {userId: idB, itemId: itemB}}}, {upsert: true});
            await users.updateOne({userId: idB, "items.id": itemB}, {$addToSet: {"items.$.matches": {userId: idA, itemId: itemA}}}, {upsert: true});

            await users.updateOne({userId: idA, "items.id": itemA}, {$pull: {"items.$.likes": {$eq: itemB}}});
            await users.updateOne({userId: idB, "items.id": itemB}, {$pull: {"items.$.likes": {$eq: itemA}}});

            const resultA = await users.findOne({userId: idA, "items.id": itemA});
            const resultB = await users.findOne({userId: idB, "items.id": itemB});

            res.send({
                match: true,
                urlA: resultA.items.filter((item) => item.id === itemA)[0].url,
                urlB: resultB.items.filter((item) => item.id === itemB)[0].url,
            })
        }
    } else if(direction == 'left'){
        await users.updateOne({userId: idA, "items.id": itemA}, {$addToSet: {"items.$.dislikes": itemB}}, {upsert: true});
        res.sendStatus(200)
    }
})

app.get('/matches/:id', async (req, res) => {
    let id = req.params.id
    let user = await getFullUser(id)
    let matches = []

    for await(let item of user.items){
        if(item.matches?.length > 0){
            for await(let match of item.matches){
                let userB = await getFullUser(match.userId)
                let itemB = userB.items.filter((item) => item.id === match.itemId)[0]

                if(!itemB) return

                let obj = {
                    itemA: {
                        url: item.url,
                        name: item.name
                    },
                    itemB: {
                        url: itemB.url,
                        name: itemB.name
                    },
                    contact: userB.email
                }

                matches.push(obj)
            }
        }
    }

    res.send(matches)
})

app.listen(port, () => {
  console.log(`Trader server listening on port ${port}`)
})

async function addItemToUser(userId, userEmail, imageId, imageUrl, imageName, imageDescription){
    try{
        const database = client.db('trader');
        const users = database.collection('users');
        const filter = { userId };
        const options = { upsert: true };
    
        const updateDoc = {
            $push: {
                items: {
                    id: imageId,
                    url: imageUrl,
                    name: imageName,
                    description: imageDescription
                }
            },
            $set: {
                email: userEmail
            }
          };
    
        const result = await users.updateOne(filter, updateDoc, options);
        return result
    } catch(e){
        return e
    }
}

async function editItem(userId, itemId, itemName, itemDescription){
    try {
        const database = client.db('trader');
        const users = database.collection('users');

        const result = users.updateOne(
            {
                userId: userId,
                "items.id": itemId
            }, 
            {
                $set: {
                    "items.$.name": itemName,
                    "items.$.description": itemDescription,
                }
            }, false);
        
        return result
    } catch(e){
        return e
    }
}

async function getUser(userId){
    try {
        const database = client.db('trader');
        const users = database.collection('users');
        const user = await users.findOne({userId}, {
            projection: {
                "items.dislikes": 0,
                "items.likes": 0,
                "items.matches": 0
            }
        });
        
        return user
    } catch(e){
        return e
    }
}

async function getFullUser(userId){
    try {
        const database = client.db('trader');
        const users = database.collection('users');
        const user = await users.findOne({userId});
        
        return user
    } catch(e){
        return e
    }
}