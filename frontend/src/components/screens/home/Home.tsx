import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
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
  const { user, isAuthenticated } = useAuth0();
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
          const result = {
            data: res.data,
          };
          setUserData(result.data.user);
        }
      },
      onError: (err) => {
        console.log("ERROR",err);
      },
    }
  );
 React.useEffect(() => {getUserById();
 }, [getUserById])
    return ( 
  <div className="grid grid-cols-5 grid-rows-5 h-max">
    <div className="col-span-1 row-span-full">
      <Link to="/profile">
        <div className="flex flex-row p-4 px-4 cursor-pointer bg-gradient-to-tr from-[#fd2879] to-[#ff8941]">      
          <img src={user?.picture} alt="Profile" className="w-10 rounded-full"/>
          <p className="flex ml-4 self-center font-semibold text-white">{user?.name}</p>            
        </div>
      </Link> 
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
          <div className="h-full">
            <ItemsList items={userData.items}/> 
            <button onClick={()=> setNotAddingProduct(false)}className="flex w-full justify-center p-4 px-4 mb-4 shadow bg-gradient-to-r from-sky-500 to-indigo-500">
            <AiOutlinePlusCircle className="text-white" size= {40}/>
            </button>
          </div>: 
          <p>No items available</p> : <p>Trades...</p>
          }
      
      

    </div>
    <div className="col-span-4 row-span-full h-max bg-[#f0f2f4]">
    <div className="flex flex-row p-8 pt-32 h-max justify-center">
        {isLoadingUser ? <p>Loading...</p>:
          !!userData && isNotAddingProduct ?
          <SwipingMenu /> :
          <div className="flex flex-col w-fit items-center">
            <CreateItemForm />
          </div>
        }
      </div>
    </div>
  </div>


    );
  }
