import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux"; 
import { addUser } from "../utils/userSlice";
import ParticleBackground from "./ParticleBackground";

export const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user)
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        BASE_URL + "/profile/view",
        {withCredentials: true}
      )
      dispatch(addUser(res.data));
    } catch (error) {
      if(error.response?.status === 401){
        navigate("/login");
      }
    }
  }

  useEffect(() => {
    if(!userData){
      fetchUser();
    }
  },[userData])
  
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      {location.pathname === "/login" ? (
        <ParticleBackground key="login-bg" densityFactor={2800} drawLines={true} interactive={true} />
      ) : (
        <ParticleBackground key="main-bg" densityFactor={8000} drawLines={false} interactive={false} />
      )}

      {location.pathname !== "/login" && <NavBar />}
      <div className={`flex-grow z-10 ${location.pathname !== "/login" ? 'pt-28 pb-24' : ''}`}>
        <Outlet />
      </div>
      {location.pathname !== "/login" && <Footer />}
    </div>
  );
};
