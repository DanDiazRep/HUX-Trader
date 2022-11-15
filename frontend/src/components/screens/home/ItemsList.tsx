import { ItemType } from "./Home";
import { AiOutlineEdit } from 'react-icons/ai'

export type ItemsListType = {
    items: ItemType[]
};

export const ItemsList = (items: ItemsListType) =>{
    return (
        <div className="realtive">
            {items.items.map(item => 
                <Item key={item.id} item={item}/>
                )
            }
        </div>
 
    );
  }

  export const Item = (item: any & ItemType) =>{
    return (
         <div className="flex flex-row p-4 px-4 mb-4 shadow">
            <div className="flex flex-row w-fill cursor-pointer">
             <img className="h-[90px] w-[120px] object-cover" src={item.item.url} alt="item"/>
            <p className="flex ml-4 self-center font-semibold text-black">{item.item.name}</p>   
            </div> 
            <div className="flex ml-2 rounded-2xl w-7 h-7 self-center justify-center hover:bg-[#616161] hover:invert cursor-pointer">
                <AiOutlineEdit className="self-center font-semibold text-black "/>   
            </div>     
        </div>
 
    );
  }