import { Match } from "../Home"
import { MatchItem } from "./MatchItem"

type MatchList = {
    matches: Match[]
}

export const Matches = ({matches}: MatchList) => {
    return(
        <div className="overflow-auto px-4 flex-1">
            {matches?.length > 0 ? 
                matches.map(match => 
                    <MatchItem key={`${match.itemA.url}-${match.itemB.url}`} match={match}/>
                ) :
                <p>You don't have any matches yet. Start swiping right on some items!</p>
            }
        </div>
    )
}