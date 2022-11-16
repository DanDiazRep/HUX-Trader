import React from 'react'
import TinderCard from 'react-tinder-card'
import { useQuery } from "react-query";
import apiClient from "../../shared/htttp-common";
import { useAuth0 } from "@auth0/auth0-react";
import { UserItemsType } from './Home';
import { IoMdClose, IoMdHeart } from "react-icons/io";

interface Props{
    selectedItem: string
}

export const SwipingMenu = (props: Props) => {
    const { user } = useAuth0();
    const [items, setItems] = React.useState<UserItemsType[]>([])
    const [lastSwiped, setLastSwiped] = React.useState<string>("")

    const { isLoading: isLoadingItems, refetch: getRandomItems } = useQuery(
        "query_random_items",
        async () => {
            if(user && user.sub){
                if(items.length > 0){
                    return await apiClient.get(`/items/${user.sub}/${items.slice(-1)[0].items[0].id}/${lastSwiped}`);
                } else if(items.length === 0 && lastSwiped === ""){
                    return await apiClient.get(`/items/${user.sub}`);
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
    
    React.useEffect(() => {
        if(items.length <= 1){
            getRandomItems()
        }
    }, [getRandomItems, items.length])

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
                .catch((error) => {
                    console.error('Error:', error);
            });
        }
    }

    return (
        <>
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
                    items.length === 0 &&
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
        </>
    );
  }