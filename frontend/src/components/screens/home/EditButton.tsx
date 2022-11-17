import { AiOutlinePlusCircle } from "react-icons/ai";
export type EditButtonType= {
    action: ()=> void
}

export const EditButton = (props : EditButtonType) => {
    return(
<button onClick={props.action}className="flex w-full justify-center p-4 px-4 shadow bg-gradient-to-r from-sky-500 to-indigo-500">
   <AiOutlinePlusCircle className="text-white" size= {40}/>
</button>
    )
}
