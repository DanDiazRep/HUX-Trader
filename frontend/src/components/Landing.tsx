import { Link } from "react-router-dom"

// This is the home screen for non logged in users
export const Landing = () =>{
  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <h1 className="text-white font-sans text-8xl font-bold">Swipe and Trade</h1>
      <Link to="/login">
        <button className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-opacity-5 px-14 py-2 rounded-full font-semibold text-white mt-7 text-lg">
          Get Started
        </button>
      </Link>
    </div>
  );
}