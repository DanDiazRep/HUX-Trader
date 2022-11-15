import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { ImExit } from "react-icons/im";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import apiClient from "../../shared/htttp-common";
import { CreateItemForm} from "./CreateItemForm";
import { ItemsList } from "./ItemsList";
import { SwipingMenu } from "./SwipeMenu";
// This will be the main logged in / swiping screen

export type UserItemsType = {
  id: string,
  userId: string,
  email: string,
  items: ItemType [],
};

export type ItemType = {
  id: string,
  url: string,
  name: string,
  description: string,
};

export const Home = () =>{
  const { user, logout } = useAuth0();
  const [userData, setUserData] = React.useState<UserItemsType>();
  const [isProductsActive, setProductsActive] = React.useState<boolean>(true);
  const [isNotAddingProduct, setNotAddingProduct] = React.useState<boolean>(true);
  
  const { isLoading: isLoadingUser, refetch: getUserById } = useQuery(
    "query_user_by_id",
    async () => {
      if(user){
        return await apiClient.get(`/user/${user.sub}`);
      }
    },
    {
      enabled: false,
      retry: 1,
      onSuccess: (res) => {
        if (res) {
          setUserData(res.data);
        }
      },
      onError: (err) => {
        console.log("ERROR",err);
      },
    }
  );

 React.useEffect(() => {
  getUserById();
 }, [getUserById])

 const addItemToUser = (item: ItemType) => {
  if(userData){
    const newObj = {...userData}
    newObj.items = [...newObj.items, item]
    setUserData(newObj)
    setNotAddingProduct(true)
  }
 }

  return ( 
    <div className="grid grid-cols-5 flex-1 max-h-screen">
      <div className="col-span-1 row-span-full overflow-hidden flex flex-col">
        <div className="flex flex-row items-center justify-between p-4 px-4 bg-gradient-to-tr from-[#fd2879] to-[#ff8941]">      
          <img src={user?.picture} alt="Profile" className="w-8 rounded-full"/>
          <p className="flex font-semibold text-white">{user?.name}</p>
          <div className="flex rounded-2xl pt-1 w-7 h-7 justify-center hover:opacity-50 cursor-pointer">
              <ImExit className="self-center font-semibold text-white"
                onClick={() => logout({ returnTo: window.location.origin })}/>   
          </div>     
        </div>
        <div className="flex flex-row p-2 mx-4">
        <button className={`font-semibold px-4 ${isProductsActive && 'underline decoration-[#fd2879] decoration-4 underline-offset-4'}`}
                onClick={() => setProductsActive(true)}>Products</button>
        <button className={`font-semibold px-4 ${!isProductsActive && 'underline decoration-[#fd2879] decoration-4 underline-offset-4'}`}
                onClick={() => setProductsActive(false)}>Trades</button>
        </div>
        
        {isProductsActive ? 
            isLoadingUser ? 
              <p>Loading...</p>:
            !!userData ?
              <>
                <ItemsList items={userData.items}/> 
                <button onClick={()=> setNotAddingProduct(false)}className="flex w-full justify-center p-4 px-4 shadow bg-gradient-to-r from-sky-500 to-indigo-500">
                  <AiOutlinePlusCircle className="text-white" size= {40}/>
                </button>
              </>
            : 
              <p>No items available</p> : <p>Trades...</p>
        }
      </div>

      <div className="col-span-4 row-span-full bg-[#f0f2f4] flex items-center justify-center">
        <div className="flex flex-row p-8 h-max justify-center">
            {isLoadingUser ? <p>Loading...</p>:
              !!userData && isNotAddingProduct ?
              <SwipingMenu /> :
              <div className="flex flex-col w-fit items-center">
                <CreateItemForm addItemToUser={addItemToUser}/>
              </div>
            }
          </div>
      </div>
    </div>
  );
}
