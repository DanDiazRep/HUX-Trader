import {useState, useEffect, Fragment} from 'react'
import TinderCard from 'react-tinder-card'
import { useQuery } from "react-query";
import apiClient from "../../shared/htttp-common";
import { useAuth0 } from "@auth0/auth0-react";
import { UserItemsType } from './Home';
import { IoMdClose, IoMdHeart } from "react-icons/io";

interface Props{
    selectedItem: string,
    getMatches: () => void
}

type Match = {
    urlA: string,
    urlB: string,
}

export const SwipeSection = (props: Props) => {
    const { user } = useAuth0();
    const [items, setItems] = useState<UserItemsType[]>([])
    const [lastSwiped, setLastSwiped] = useState<string>("")
    const [matched, setMatched] = useState<boolean>(false)
    const [match, setMatch] = useState<Match>()

    const { refetch: getRandomItems, isFetching: isFetchingNewItems } = useQuery(
        "query_random_items",
        async () => {
            if(user && user.sub){
                if(items.length > 0 && lastSwiped !== ""){
                    return await apiClient.get(`/items/${user.sub}/${props.selectedItem}/${items.slice(-1)[0].items[0].id}/${lastSwiped}`);
                } else if(items.length === 0 && lastSwiped === ""){
                    return await apiClient.get(`/items/${user.sub}/${props.selectedItem}`);
                }
            }
        },
        {
            enabled: false,
            retry: 1,
            onSuccess: (res) => {
                if (res) {
                    let newArr = [...items]
                    res.data.forEach((element: UserItemsType) => {
                        newArr.unshift(element)
                    });
                    setItems(newArr)
                }
            },
            onError: (err) => {
                console.log("ERROR",err);
            },
        }
    );
    
    useEffect(() => {
        if(items.length <= 1){
            getRandomItems()
        }
    }, [getRandomItems, items.length])

    useEffect(() => {
        setLastSwiped("")
        setItems([])
        setTimeout(() => {
            getRandomItems()
        }, 100)
    }, [props.selectedItem, getRandomItems])

    const swiped = (direction: string, itemId: string, userId: string) => {
        if(itemId.split('|')[0] === items.slice(-1)[0].items[0].id){
            setLastSwiped(itemId)
            const lastRemoved = items.filter((item, index) => index !== items.length - 1);
            const filteredArray = lastRemoved.filter((item) => item.id !== itemId)
            setItems(filteredArray)

            fetch('http://localhost:3030/swipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                        userA: user!.sub,
                        itemA: props.selectedItem,
                        userB: userId,
                        itemB: itemId,
                        direction
                    }),
                })
                .then((response) => response.json())
                .then((data) => {
                    if(data.match){
                        setMatch({
                            urlA: data.urlA,
                            urlB: data.urlB
                        })
                        setMatched(true)
                        props.getMatches()
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
            });
        }
    }

    return (
        <Fragment>
            <div className="flex flex-col p-8 h-max justify-center relative">
                {items.length > 0 && items.map((record) =>
                    <div key={record.items[0].id + '|' + Math.random() + Math.random()} className='absolute swipeable select-none'>
                        <TinderCard className='swipe' 
                            onSwipe={(dir) => swiped(dir, record.items[0].id, record.userId)}
                            preventSwipe={["up", "down"]}>
                            <div className="flex-row cursor-pointer w-[350px] h-[550px] m-4 rounded-lg shadow-sm bg-[#FFF]">
                                <div className="overflow-hidden relative h-full">
                                    <div className="rounded object-cover z-1 h-[550px] shadow-sm bg-gradient-to-b from-[#c4c4c4] to-black">
                                        <img className="rounded object-cover z-0 h-[550px] opacity-50 select-none" 
                                            src={record.items[0].url} alt={record.items[0].name} draggable={false}/>
                                    </div>
                                    <div className='p-4 absolute bottom-[0px] w-full text-white'>
                                        <h1 className='font-bold text-2xl'>{record.items[0].name}</h1>
                                        <h2>{record.items[0].description}</h2>
                                    </div>
                                </div>
                            </div> 
                        </TinderCard>
                    </div>
                )}
                {
                    !isFetchingNewItems && items.length === 0 &&
                    <p>We don't have any more items for you right now.</p>
                }
            </div>
            {
                items.length > 0 && 
                <div className='absolute bottom-10 flex items-center gap-5'>
                    <div className='bg-white p-3 rounded-full cursor-pointer hover:bg-red-50 select-none'
                        onClick={() => swiped('left', items.slice(-1)[0].items[0].id, items.slice(-1)[0].userId)}>
                        <IoMdClose className="self-center font-semibold text-red-600 text-3xl"/>
                    </div>
                    <div className='bg-white p-3 rounded-full cursor-pointer hover:bg-green-50 select-none'
                        onClick={() => swiped('right', items.slice(-1)[0].items[0].id, items.slice(-1)[0].userId)}>
                        <IoMdHeart className="self-center font-semibold text-green-400 text-3xl"/>
                    </div>
                </div>
            }
            {
                matched &&
                <Fragment>
                    <div className='fadeIn blur absolute w-full h-full left-0'>
                    </div>
                    <div className='fadeIn absolute bg-black bg-opacity-80 w-full h-full left-0 flex flex-col justify-center items-center'>
                        <div className='slideDown text-green-400 font-extrabold italic flex flex-col items-center'>
                            <p className='text-4xl'>IT'S A</p>
                            <p className='text-6xl'>MATCH!</p>
                        </div>
                        <p className='slideDown text-white mt-3 mb-14 font-light'>You have found a potential trade!</p>
                        <div className='flex items-center gap-10'>
                            <img className='slideRight w-52 h-52 object-cover rounded-full border-2 border-white' src={match?.urlA} alt="itemA"/>
                            <img className='slideLeft w-52 h-52 object-cover rounded-full border-2 border-white' src={match?.urlB} alt="itemB"/>
                        </div>
                        <button className="slideUp mt-14 bg-gradient-to-r from-[#fd2879] to-[#ff8941] bg-opacity-5 px-14 py-2 rounded-md font-semibold text-white text-lg"
                            onClick={() => setMatched(false)}>
                            Continue
                        </button>
                    </div>
                </Fragment>
            }
        </Fragment>
    );
  }