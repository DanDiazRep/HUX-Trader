import { Navbar } from "./components/shared/NavBar";
import { Auth0Provider } from "@auth0/auth0-react";
import "./App.css";
import { Landing } from "./components/Landing";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./components/auth/Login";
import Profile from "./components/auth/Profile";
import { Container } from "./components/shared/Container";
import { HomeSwitch } from "./components/HomeSwitch";

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
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Container>
            <div className="container mx-auto px-6 min-h-full">
              <Routes>
                <Route path="/" element={<HomeSwitch/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/profile" element={<Profile/>}/>
              </Routes>
            </div>
          </Container>
        </div>
      </Router>
    </Auth0Provider>
  );
};

export default App;