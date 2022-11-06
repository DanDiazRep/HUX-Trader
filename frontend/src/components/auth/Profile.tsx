import { useAuth0 } from "@auth0/auth0-react"
import {Fragment} from "react"

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    console.log(user)

    return(
        <div className="flex flex-col items-center">
            {
                !isAuthenticated && <p>Please log in</p>
            }
            {
                (isAuthenticated && isLoading) && <p>Loading</p>
            }
            {
                user && (
                    <Fragment>
                        <img src={user.picture} alt="Profile" className="w-40 rounded-full"/>
                        <p>{user.email}</p>
                    </Fragment>
                )
            }
        </div>
    );
};

export default Profile;