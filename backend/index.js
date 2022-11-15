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
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
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

app.patch('/item', async (req, res) => {
    let id = req.body.id
    let itemId = req.body.item.id
    let itemName = req.body.item.name
    let itemDescription = req.body.item.description

    let result = await editItem(id, itemId, itemName, itemDescription)

    if(result.acknowledged && result.matchedCount){
        res.sendStatus(200)
    } else{
        res.sendStatus(500)
    }
})

app.get('/items/:id', async (req, res) => {
    let id = req.params.id
    try {
        const database = client.db('trader');
        const users = database.collection('users');
        const result = users.aggregate([
            {
              '$match': {
                'userId': {
                  '$ne': id
                }
              }
            }, {
              '$sample': {
                'size': 2
              }
            }
          ])
        let items = []
        for await (const doc of result) {
            items.push({id: doc._id, userId: doc.userId, email: doc.email, items: [doc.items[Math.floor(Math.random() * doc.items.length)]]});
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
        const filter = { userId };
        const user = await users.findOne(filter);
        
        return user
    } catch(e){
        return e
    }
}