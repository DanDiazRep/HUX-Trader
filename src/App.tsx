import { useState, useEffect } from "react";
import {Navbar} from "./components/navigation";

import "./App.css";
import { Landing } from "./components/landing";


const App = () => {
  
  return (
    <div>
      <Navbar />
      <Landing />
     
    </div>
  );
};

export default App;