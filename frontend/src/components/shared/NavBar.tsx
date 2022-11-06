import { useAuth0 } from "@auth0/auth0-react";
import {useState, Fragment} from "react";
import {Link} from "react-router-dom"
import LogoutButton from "../auth/LogoutButton";

export const Navbar =()  =>{
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { isAuthenticated } = useAuth0();
  
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3h-14 bg-gradient-to-r from-sky-500 to-indigo-500">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              to="/"
            >
              TRADER
            </Link>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {
                isAuthenticated ? (
                  <Fragment>
                    <li className="nav-item">
                      <Link
                        className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                        to="/profile"
                      >
                      <span className="ml-2">Profile</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <LogoutButton/>
                    </li>
                  </Fragment>
                ) : (
                  <li className="nav-item">
                    <Link
                      className="py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                      to="/login"
                    >
                    <span className="ml-2">Log in</span>
                    </Link>
                  </li>
                )
              }
              
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}