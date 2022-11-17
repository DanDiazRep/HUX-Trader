import { useAuth0, User } from "@auth0/auth0-react";
import { useState, Fragment } from "react";
import { useQuery } from "react-query";
import apiClient from "../../../shared/htttp-common";
import {AiOutlinePlusCircle} from 'react-icons/ai';
import { ItemType } from "../Home";
import { NameAndDescription } from "./NameAndDescription";

interface Props {
  setNotAddingProduct: (toggle: boolean) => void,
  addItemToUser: (item: ItemType) => void
}

export type CreateItemType = {
    user: User | undefined,
    image: string,
    name: string,
    description: string,
}

export const CreateItemForm = ({addItemToUser, setNotAddingProduct}: Props) =>{
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [imageData, setImage] = useState<File>();
    const [imageUrl, setImageUrl] = useState<string>("");

    const { user } = useAuth0();

    const { refetch: createNewItem } = useQuery(
        "query_create_item",
        async () => {
          if(!!user?.sub && !!user?.email && !!name && !!description && !!imageData){
            let data = new FormData()
            data.append("id", user.sub);
            data.append("email", user.email);
            data.append("name", name);
            data.append("description", description);
            data.append("image", imageData);

            return await apiClient.post(`/item`, data);
          }
        },
        {
          onSuccess: (res) => {
            if (res) {
              if(res.data){
                addItemToUser(res.data as ItemType)
              }
            }
          },
          onError: (err) => {
            console.log("ERROR",err);
          },
        }
      );      
    

    return (
      <Fragment>
        <div className="flex-row w-[350px] h-[550px] m-4 justify-center rounded-lg shadow-sm bg-[#FFF] create-item">
            <div className="h-full">
                <label htmlFor="file-upload" className="flex h-full custom-file-upload cursor-pointer justify-center">
                    {!!imageUrl ? 
                    <Fragment>
                      <div className="w-[400px] rounded object-cover z-1 h-[550px] bg-black">
                        <img className="w-[400px] rounded object-cover z-0 h-[550px] opacity-80" src={imageUrl} alt="product"/>
                      </div>
                    </Fragment>:
                    <div className="flex flex-col items-center self-center">
                      <AiOutlinePlusCircle size= {100}/>
                      <p className="text-white font-semibold mt-4 py-2 px-5 rounded-md bg-gradient-to-tr from-[#fd2879] to-[#ff8941]">Upload a picture</p>
                    </div>
                }
                </label>
                <input className="hidden" id="file-upload" type="file" 
                onChange={(e) => { 
                    if (e.target.files != null) {
                        setImage(e.target.files[0]);
                        setImageUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  
                  }} />
            </div>  
            {!!imageUrl &&
            <NameAndDescription name={name} setName={setName} description={description} setDescription={setDescription}/>
            }
        </div> 
        <div className="absolute bottom-10 flex w-full justify-center gap-5">
          { !!description && !!name &&
            <button type="button" className="text-white py-2 px-4 font-semibold rounded-md bg-gradient-to-tr from-[#fd2879] to-[#ff8941]" onClick={(e) => createNewItem()}>Create</button>
          }
            <button type="button" className="py-2 px-4 font-semibold rounded-md bg-gray-300 text-black" onClick={(e) => setNotAddingProduct(true)}>Cancel</button>
        </div>
      </Fragment>
    );
  }
