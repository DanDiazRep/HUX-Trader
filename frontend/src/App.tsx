import { Navbar } from "./components/shared/NavBar";
import { Auth0Provider } from "@auth0/auth0-react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./components/auth/Login";
import Profile from "./components/screens/profile/Profile";
import { HomeSwitch } from "./components/screens/landing/HomeSwitch";

const App = () => {
  const domain: string = process.env.REACT_APP_AUTH0_DOMAIN
  const clientId: string = process.env.REACT_APP_AUTH0_CLIENT_ID
  
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
    >
      <Router>
        <div className="relative flex flex-col h-screen w-screen">
          <Navbar />            
              <Routes>
                <Route path="/" element={<HomeSwitch/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/profile" element={<Profile/>}/>
              </Routes>          
        </div>
      </Router>
    </Auth0Provider>
  );
};

export default App;