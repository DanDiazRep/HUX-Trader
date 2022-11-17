import { ItemType } from "../Home";
import { Item } from "./Item";

export type ItemsListType = {
    items: ItemType[],
    selectedItem: string,
    setSelectedItem: (id: string) => void,
    setNotEditingProduct: (toggle: boolean) => void
};

export const ItemsList = ({items, selectedItem, setSelectedItem, setNotEditingProduct}: ItemsListType) => {
    return (
        <div className="overflow-auto px-4 flex-1">
            {items?.length > 0 ? 
                items.map(item => 
                    <Item key={item.id} item={item} selectedItem={selectedItem} setSelectedItem={setSelectedItem} setNotEditingProduct={setNotEditingProduct}/>
                ) :
                <p>You don't have any items yet. Start by clicking the button below!</p>
            }
        </div>
    );
}