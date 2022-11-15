import { Auth0Provider } from "@auth0/auth0-react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./components/auth/Login";
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
        <div className="relative flex flex-col h-screen">
              <Routes>
                <Route path="/" element={<HomeSwitch/>}/>
                <Route path="/login" element={<Login/>}/>
              </Routes>          
        </div>
      </Router>
    </Auth0Provider>
  );
};

export default App;