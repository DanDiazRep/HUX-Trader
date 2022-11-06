import { useAuth0 } from "@auth0/auth0-react";

type Props = {
    children: JSX.Element
}

export const Container = ({children}: Props) =>{
    const backgroundImage = "https://tinder.com/static/build/07eef8b101ca939c978a599f508aa955.webp"
    const { isAuthenticated } = useAuth0();

    return(
        <div className="grow flex" style={{backgroundImage: isAuthenticated ? '' : `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`}}>
            {children}
        </div>
    );
  }