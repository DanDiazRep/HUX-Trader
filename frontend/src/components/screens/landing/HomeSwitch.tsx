import { useAuth0 } from "@auth0/auth0-react";
import { Landing } from "./Landing";
import { Home } from "../home/Home"
import { About } from "./About"
import { Fragment } from "react"

// This component checks if the user is authenticated and renders the correct component
// This way we can use the root route "/" for both logged in and non logged in users
export const HomeSwitch = () =>{
    const { isAuthenticated } = useAuth0();

    return (
        <Fragment>
            {
                isAuthenticated ? (
                    <Home/>
                ) : (
                    <Fragment>
                        <Landing />
                        <About />
                    </Fragment>
                )
            }
        </Fragment>
    )
  }