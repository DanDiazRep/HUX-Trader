import { ItemType } from "./Home";
import { AiOutlineEdit } from 'react-icons/ai'

export type ItemsListType = {
    items: ItemType[],
    selectedItem: string,
    setSelectedItem: (id: string) => void
};

type ItemCard = {
    item: ItemType,
    selectedItem: string,
    setSelectedItem: (id: string) => void
}

export const ItemsList = ({items, selectedItem, setSelectedItem}: ItemsListType) =>{
    return (
        <div className="overflow-auto p-3 flex-1">
            {items?.length > 0 ? 
                items.map(item => 
                    <Item key={item.id} item={item} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
                ) :
                <p>You don't have any items yet. Start by clicking the button below!</p>
            }
        </div>
    );
  }

  export const Item = ({item, selectedItem, setSelectedItem}: ItemCard) => {
    return (
         <div className={`flex flex-row p-4 px-4 mb-4 shadow rounded-md ${item.id === selectedItem ? 'border-b border-[#fd2879]' : 'border-b border-transparent'}`}
            onClick={() => setSelectedItem(item.id)}>
            <div className="flex flex-row w-fill cursor-pointer">
                <img className="h-[90px] w-[120px] object-cover rounded-md" src={item.url} alt="item"/>
                <p className="flex ml-4 self-center font-semibold text-black">{item.name}</p>   
            </div> 
            <div className="flex ml-2 rounded-2xl w-7 h-7 self-center justify-center hover:bg-[#616161] hover:invert cursor-pointer">
                <AiOutlineEdit className="self-center font-semibold text-black "/>   
            </div>     
        </div>
    );
  }