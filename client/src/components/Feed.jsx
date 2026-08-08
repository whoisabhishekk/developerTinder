import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";
import { motion, AnimatePresence } from "framer-motion";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data.data));
    } catch (error) {
      console.log(error.response?.data || error.message);
      navigate("/login");
    }
  };

  const handleRequest = async (status, _id) => {
    // Optimistic UI update: instantly remove the swiped card to show the next one without waiting for API
    dispatch(removeUserFromFeed(_id));
    
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length === 0) {
    return (
      <div className="flex justify-center items-center my-20">
        <h1 className="text-xl font-semibold text-gray-700">No new users found!</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start my-6 px-4">
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg h-[75vh] sm:h-[750px] perspective-1000">
        <AnimatePresence>
          {feed && feed.slice(0, 2).reverse().map((user, index) => {
            const isFront = user._id === feed[0]._id;
            return (
              <motion.div 
                key={user._id}
                layout
                initial={{ scale: 0.85, opacity: 0, y: 60 }}
                animate={{ 
                  scale: isFront ? 1 : 0.94, 
                  opacity: isFront ? 1 : 0.8,
                  y: isFront ? 0 : 30,
                  zIndex: isFront ? 10 : 0
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25,
                  mass: 0.6 
                }}
                className={`absolute inset-0 flex justify-center origin-bottom ${!isFront ? 'pointer-events-none' : ''}`}
              >
                <UserCard user={user} onAction={isFront ? handleRequest : null} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Feed;