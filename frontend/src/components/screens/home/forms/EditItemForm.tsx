import { useAuth0, User } from "@auth0/auth0-react";
import { useContext, useEffect, useState, Fragment } from "react";
import apiClient from "../../../shared/htttp-common";
import { NameAndDescription } from "./NameAndDescription";
import { ItemType, UserContext } from "../Home";

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
    const [name, setName] = useState<string>(editedItem.name);
    const [description, setDescription] = useState<string>(editedItem.description); 
    const { user } = useAuth0();
    const {refetch: getUserById} = useContext(UserContext);

    const editItem = async () => {
          if(!!user?.sub && !!name && !!description){
            let data = new FormData()
            data.append("id", user.sub);
            data.append("itemId", editedItem.id);
            data.append("itemName", name);
            data.append("itemDescription", description);

            return await apiClient.patch(`/item`, data)
            .then((res) => {
              editedItem.description = description;
              editedItem.name = name;
              setNotEditingProduct(true)
          })
          .catch((err) => {
            console.log("ERROR",err);
          })
          }
        };    

    const deleteItem = async () => {
        if(!!user?.sub && !!editedItem.id){
          let data = new FormData()
          data.append("userId", user.sub);  
          data.append("itemId", editedItem.id);           

          return await apiClient.patch(`/delete`, data)            
          .then((res) => {                
            setNotEditingProduct(true);
            if (getUserById) 
            getUserById();
        })
        .catch((err) => {
          console.log("ERROR DELETING ITEM",err);
          if (getUserById) 
            getUserById();
        })
        }        
    };      
  
  
    useEffect(() => {
      setName(editedItem.name);
      setDescription(editedItem.description);
    }, [editedItem]); 

    return (
      <Fragment>
        <div className="flex-row w-[350px] h-[550px] m-4 justify-center rounded-lg shadow-sm bg-[#FFF] create-item">
            <div className="h-full">
                <label htmlFor="file-upload" className="flex h-full custom-file-upload cursor-pointer justify-center">
                  { <Fragment>
                      <div className="w-[400px] rounded object-cover z-1 h-[550px] bg-black">
                        <img className="w-[400px] rounded object-cover z-0 h-[550px] opacity-80" src={editedItem.url} alt="product"/>
                      </div>
                    </Fragment>
                  }
                </label>
            </div>  
            {
            <NameAndDescription name={name} setName={setName} description={description} setDescription={setDescription}/>
            }
        </div> 
        <div className="absolute bottom-10 flex w-full justify-center gap-5">
          { !!description && !!name &&
            <button type="button" 
            className="text-white py-2 px-4 font-semibold rounded-md bg-gradient-to-tr from-[#fd2879] to-[#ff8941]" 
            onClick={(e) => editItem()}>Save</button>
          }
            <button type="button" 
            className="py-2 px-4 font-semibold rounded-md bg-gray-300 text-black" 
            onClick={(e) => setNotEditingProduct(true)}>Cancel</button>
        </div>
        <button type="button" 
        className="absolute bottom-0 right-0 m-10 py-2 px-4 font-semibold rounded-md bg-red-600 text-white" 
        onClick={(e) => {
          deleteItem(); 
          setNotEditingProduct(true);          
            }
          }>Delete</button>
      </Fragment>
    );
  }
