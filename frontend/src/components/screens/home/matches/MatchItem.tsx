import { IoMdClose } from "react-icons/io";
import { MdOutlineAlternateEmail } from "react-icons/md"
import { Match } from "../Home";

type MatchItemType = {
    match: Match
}

export const MatchItem = ({match}: MatchItemType) => {
    return(
        <div className="p-4 px-4 mb-4 shadow rounded-md">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col justify-between">
                    <p className="mb-1">You</p>
                    <div className="flex flex-row w-fill">
                        <img className="h-[90px] w-[90px] object-cover rounded-md" src={match.itemA.url} alt="item"/>
                    </div>
                    <p className="block font-semibold text-black text-sm w-[90px] mt-1">{match.itemA.name}</p>  
                </div>
                <IoMdClose color="grey"/>
                <div className="flex flex-col justify-between items-end">
                    <p className="mb-1">Them</p>
                    <div className="flex flex-row w-fill">
                        <img className="h-[90px] w-[90px] object-cover rounded-md" src={match.itemB.url} alt="item"/>
                    </div>
                    <p className="block font-semibold text-black text-right text-sm w-[90px] mt-1">{match.itemB.name}</p>  
                </div>
            </div>
            <div className="mt-5 flex gap-2 items-center overflow-hidden">
                <MdOutlineAlternateEmail color="grey"/>
                <a href={`mailto:${match.contact}`} className="pb-1 text-gray-600 max-w-[90%]">{match.contact}</a>
            </div>
        </div>
    )
}