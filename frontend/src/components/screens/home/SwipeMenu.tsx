import React from 'react'
import TinderCard from 'react-tinder-card'
import { useQuery } from "react-query";
import apiClient from "../../shared/htttp-common";
import { useAuth0 } from "@auth0/auth0-react";
import { UserItemsType } from './Home';

export const SwipingMenu = () => {
    const { user } = useAuth0();
    const [items, setItems] = React.useState<UserItemsType[]>([])

    const { isLoading: isLoadingItems, refetch: getRandomItems } = useQuery(
        "query_random_items",
        async () => {
            if(user && user.sub){
                return await apiClient.get(`/items/${user.sub}`);
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
        getRandomItems();
    }, [getRandomItems])

    const swiped = (direction: string, idToDelete: string) => {
        if(idToDelete.split('|')[0] === items.slice(-1)[0].items[0].id){
            const filteredArray = items.filter((item, index) => index !== items.length - 1);
            setItems(filteredArray)
            if(filteredArray.length < 2){
                getRandomItems()
            }
        }
    }

    return (
        <>
            {items.length > 0 && items.map((record) =>
                <div key={record.items[0].id + '|' + Math.random() + Math.random()} className='absolute swipeable select-none'>
                    <TinderCard className='swipe' 
                        onSwipe={(dir) => swiped(dir, record.items[0].id)}
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
        </>
    );
  }