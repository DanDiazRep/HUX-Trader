import { useAuth0, User } from "@auth0/auth0-react";
import React from "react";
import { useQuery } from "react-query";
import apiClient from "../../shared/htttp-common";
import {AiOutlinePlusCircle} from 'react-icons/ai';
import { ItemType } from "./Home";

interface Props {
  addItemToUser: (item: ItemType) => void
}

export type CreateItemType = {
    user: User | undefined,
    image: string,
    name: string,
    description: string,
}

export const CreateItemForm = ({addItemToUser}: Props) =>{
    const [name, setName] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [imageData, setImage] = React.useState<File>();
    const [imageUrl, setImageUrl] = React.useState<string>("");

    const { user, isAuthenticated } = useAuth0();

    const { isLoading: isPosting, refetch: createNewItem } = useQuery(
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
              console.log(res)
              if(res.data){
                console.log("post result", res.data);
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
        <div className="flex-row w-[350px] h-[550px] m-4 justify-center justify-self-center self-center justify-items-center rounded-lg shadow-xl bg-[#FFF]">
            <form>
            <div>
                <label htmlFor="file-upload" className="flex custom-file-upload cursor-pointer justify-center">
                    {!!imageUrl ? <>
                    <div className="w-[400px] rounded object-cover z-1 h-[450px] bg-gradient-to-b from-[#c4c4c4] to-black">
                      <img className="w-[400px] rounded object-cover z-0 h-[450px] opacity-80" src={imageUrl} alt="product"/>
                    </div></>:
                    <div className="relative top-24 text-center self-center">
                      <AiOutlinePlusCircle size= {160}/>
                      <p className="text-white font-semibold rounded-xl bg-gradient-to-tr from-[#fd2879] to-[#ff8941]">Upload a picture</p>
                    </div>
                }
                </label>
                <input className="hidden" id="file-upload" type="file" 
                onChange={(e) => { 
                    console.log(e.target.files);
                    if (e.target.files != null) {
                        setImage(e.target.files[0]);
                        setImageUrl(URL.createObjectURL(e.target.files[0]));
                    }
                    }
                } />
            </div>  
            {!!imageUrl && <>
            <div className="block relative bottom-[100px] px-4">
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
              { !!description && !!name &&
                <button type="button" className="flex content-center relative bottom-[54px] mx-32 text-white py-2 px-4 font-semibold rounded-2xl bg-gradient-to-tr from-[#fd2879] to-[#ff8941]" onClick={(e) =>createNewItem()}>Create</button>
              }
                </>
              }
            </form>
        </div> 
    );
  }
