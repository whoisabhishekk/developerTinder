import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connection);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      console.log("Logout successful:", res.data);
      dispatch(removeUser());
      navigate("/");
    } catch (error) {
      console.log("Logout failed:", error.response?.data || error.message);
    }
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="navbar bg-gray-900/90 backdrop-blur-2xl border border-gray-700/50 shadow-2xl shadow-gray-900/20 rounded-full px-6 md:px-8 h-16 transition-all duration-300">
        <div className="flex-1">
          <Link to='/' className="btn btn-ghost text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform">
            DevTinder
          </Link>
        </div>
        <div className="flex gap-2 animate-fade-in">
          {user && (
            <div className="flex items-center gap-2 md:gap-4 mx-2 md:mx-2">
              <p className="hidden sm:block text-gray-300 font-medium text-sm tracking-wide">
                Welcome, <span className="font-bold text-white">{user.firstName}</span>
              </p>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar ring-2 ring-gray-700 hover:ring-primary/60 transition-all duration-300 shadow-sm"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="User avatar"
                      src={user.photoUrl || "https://geographyandyou.com/images/user-profile.png"}
                    />
                  </div>
                </div>
                <ul
                  tabIndex="-1"
                  className="menu menu-sm dropdown-content bg-white/95 backdrop-blur-md rounded-3xl z-10 mt-5 w-56 p-3 shadow-2xl border border-gray-100/80 gap-1 animate-slide-up"
                >
                  <li>
                    <Link to='/profile' className="justify-between text-gray-700 hover:bg-gray-50/80 rounded-xl py-3 font-semibold transition-colors">
                      Profile
                      <span className="badge badge-sm bg-primary/10 text-primary border-0 font-bold">
                        New
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/connections" className="justify-between text-gray-700 hover:bg-gray-50/80 rounded-xl py-3 font-semibold transition-colors">
                      Connections
                      <span className="badge badge-sm bg-secondary/10 text-secondary border-0 font-bold">
                        {connections ? connections.length : 0}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/request" className="justify-between text-gray-700 hover:bg-gray-50/80 rounded-xl py-3 font-semibold transition-colors">
                      Requests
                      <span className="badge badge-sm bg-accent/10 text-accent border-0 font-bold">
                        {requests ? requests.length : 0}
                      </span>
                    </Link>
                  </li>
                  <div className="divider my-0 opacity-50"></div>
                  <li>
                    <a className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl py-3 font-semibold transition-colors"
                    onClick={handleLogout}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;