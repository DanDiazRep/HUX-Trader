import { Link } from "react-router-dom"
import "../../../App.css";

// This is the home screen for non logged in users
export const Landing = () =>{
  const backgroundImage = require("./../../../resources/trader_background.png");
  return (
    <>
      <div className="absolute w-full py-5 px-8 flex items-center justify-between">
        <h2 className="text-white font-bold text-3xl">Trader</h2>
        <Link to="/login">
          <button className="py-2 px-8 rounded-full bg-white font-bold">Log In</button>
        </Link>
      </div>
      <div className="landing-bg" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`}}>
        <div className="flex flex-col items-center justify-center min-h-full py-64">
          <h1 className="text-white font-sans text-8xl font-bold">Swipe and Trade</h1>
          <Link to="/login">
            <button className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-opacity-5 px-14 py-2 rounded-full font-semibold text-white mt-7 text-lg">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}