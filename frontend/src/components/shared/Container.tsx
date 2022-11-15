import { useAuth0 } from "@auth0/auth0-react";
import BackgroundImg from "../../assets/trader_background.png"

type Props = {
    children: JSX.Element
}

export const Container = ({children}: Props) =>{
    const { isAuthenticated } = useAuth0();

    return(
        <div className="grow flex" style={{backgroundImage: isAuthenticated ? '' : `linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.75)), url(${BackgroundImg})`}}>
            {children}
        </div>
    );
  }