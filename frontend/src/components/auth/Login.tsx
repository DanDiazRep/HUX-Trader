import { useAuth0 } from "@auth0/auth0-react"
import { Fragment } from "react"

const Login = () => {
    const { loginWithRedirect } = useAuth0();

    loginWithRedirect()

    return(
        <Fragment></Fragment>
    );
};

export default Login;