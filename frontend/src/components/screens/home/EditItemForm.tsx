import { useAuth0, User } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import apiClient from "../../shared/htttp-common";
import { ItemType } from "./Home";

interface Props {
  editedItem: ItemType,
  setNotEditingProduct: (toggle: boolean) => void,
}

export type CreateItemType = {
    user: User | undefined,
    image: string,
    name: string,
    description: string,
}

export const EditItemForm = ({setNotEditingProduct, editedItem}: Props) =>{
    const [name, setName] = React.useState<string>(editedItem.name);
    const [description, setDescription] = React.useState<string>(editedItem.description);

    const { user, isAuthenticated } = useAuth0();

    const { isLoading: isPosting, refetch: editItem } = useQuery(
        "query_edit_item",
        async () => {
          if(!!user?.sub && !!name && !!description){
            let data = new FormData()
            data.append("id", user.sub);
            data.append("itemId", editedItem.id);
            data.append("itemName", name);
            data.append("itemDescription", description);

            return await apiClient.patch(`/item`, data);
          }
        },
        {
          onSuccess: (res) => {
              editedItem.description = description;
              editedItem.name = name;
              setNotEditingProduct(true)
          },
          onError: (err) => {
            console.log("ERROR",err);
          },
        }
      );      
    
      useEffect(() => {
        setName(editedItem.name);
        setDescription(editedItem.description);
      }, [editedItem]); 

    return (
      <>
        <div className="flex-row w-[350px] h-[550px] m-4 justify-center rounded-lg shadow-sm bg-[#FFF] create-item">
            <div className="h-full">
                <label htmlFor="file-upload" className="flex h-full custom-file-upload cursor-pointer justify-center">
                  {<>
                    <div className="w-[400px] rounded object-cover z-1 h-[550px] bg-black">
                      <img className="w-[400px] rounded object-cover z-0 h-[550px] opacity-80" src={editedItem.url} alt="product"/>
                    </div></>
                  }
                </label>
            </div>  
            {
            <>
              <div className="block relative bottom-[120px] px-4">
                  <input 
                    type="text" 
                    name="floating_name" 
                    id="floating_name" 
                    className="py-2.5 px-0 w-full text-2xl font-bold placeholder-white placeholder-text-xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-[#fd2879] dark:focus:border-[#ff8941] focus:outline-none focus:ring-0 focus:border-[#fd2879] peer" 
                    placeholder="Name" required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}/>
                  <label 
                    htmlFor="floating_name" 
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#fd2879] peer-focus:dark:text-[#fd2879] peer-placeholder-shown:scale-100  peer-focus:scale-75 ">
                      Name
                  </label>
                  <input 
                    type="text" 
                    name="floating_description" 
                    id="floating_description" 
                    className="py-2.5 px-0 w-full text-ms font-bold placeholder-white placeholder-text-xl text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none dark:text-white dark:border-[#fd2879] dark:focus:border-[#ff8941] focus:outline-none focus:ring-0 focus:border-[#fd2879] peer" 
                    placeholder="Description" required 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}/>
                  <label 
                    htmlFor="floating_description" 
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#fd2879] peer-focus:dark:text-[#fd2879] peer-placeholder-shown:scale-100 peer-focus:scale-75 ">
                      Description
                  </label>
                </div>
              </>
            }
        </div> 
        <div className="absolute bottom-10 flex w-full justify-center gap-5">
          { !!description && !!name &&
            <button type="button" className="text-white py-2 px-4 font-semibold rounded-md bg-gradient-to-tr from-[#fd2879] to-[#ff8941]" onClick={(e) => editItem()}>Edit</button>
          }
            <button type="button" className="py-2 px-4 font-semibold rounded-md bg-gray-300 text-black" onClick={(e) => setNotEditingProduct(true)}>Cancel</button>
        </div>
      </>
    );
  }
