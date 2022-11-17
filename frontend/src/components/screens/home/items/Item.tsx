import { AiOutlineEdit } from "react-icons/ai";
import { ItemType } from "../Home";

type ItemCard = {
    item: ItemType,
    selectedItem: string,
    setSelectedItem: (id: string) => void,
    setNotEditingProduct: (toggle: boolean) => void
}

export const Item = ({item, selectedItem, setSelectedItem, setNotEditingProduct}: ItemCard) => {
    return (
         <div className={`flex flex-row justify-between p-4 px-4 mb-4 shadow cursor-pointer rounded-md ${item.id === selectedItem ? 'border-b border-[#fd2879]' : 'border-b border-transparent'}`}
            onClick={() => setSelectedItem(item.id)}>
            <div className="flex flex-row w-fill">
                <img className="h-[90px] w-[90px] object-cover rounded-md" src={item.url} alt="item"/>
                <p className="flex ml-4 self-center font-semibold text-black">{item.name}</p>   
            </div> 
            <div className="flex ml-2 rounded-full p-2 self-center justify-center hover:bg-[#616161] hover:invert cursor-pointer"
                onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    setSelectedItem(item.id)
                    setNotEditingProduct(false)
                }}>
                <AiOutlineEdit className="self-center font-semibold text-black text-md"/>   
            </div>     
        </div>
    );
}