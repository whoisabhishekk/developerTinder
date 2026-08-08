import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/ConnectionSlice';
import UserCard from './UserCard';

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log("Full response:", JSON.stringify(res.data));
      console.log("Connections data:", res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center mt-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Connections</h1>
        <p className="text-gray-500">No connections yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center my-10 px-4">
      <h1 className="text-3xl font-black text-white mb-8 tracking-tight drop-shadow-sm">
        Connections ({connections.length})
      </h1>
      <div className="w-full max-w-2xl flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {connections.map((connection, index) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;
          return (
            <div
              key={_id}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/10 transition-all duration-300 hover:shadow-2xl hover:border-white/20 hover:-translate-y-0.5 animate-fade-in"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <div className="relative">
                <img
                  src={
                    photoUrl ||
                    "https://geographyandyou.com/images/user-profile.png"
                  }
                  alt={`${firstName} ${lastName}`}
                  className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover border-[3px] border-gray-800 shadow-sm group-hover:border-primary/50 transition-colors"
                />
                <div className="absolute inset-0 rounded-full shadow-inner ring-1 ring-white/10"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl sm:text-lg font-bold text-gray-100 tracking-tight">
                    {firstName} {lastName}
                  </h2>
                  <span className="flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
                </div>
                {(age || gender) && (
                  <p className="text-sm font-medium text-gray-400 capitalize mb-1">
                    {age && `${age} yrs`}
                    {age && gender && " • "}
                    {gender}
                  </p>
                )}
                {about && (
                  <p className="text-sm text-gray-400/80 line-clamp-2 leading-relaxed">
                    {about}
                  </p>
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-auto w-full sm:w-auto flex gap-2">
                <button 
                  onClick={() => navigate("/chat/" + _id)}
                  className="btn btn-outline border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 hover:border-purple-400/50 rounded-2xl text-sm font-bold w-full sm:w-auto shadow-sm backdrop-blur-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-1">
                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                  </svg>
                  Chat
                </button>
                <button 
                  onClick={() => setSelectedUser(connection)}
                  className="btn btn-outline border-white/20 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/40 rounded-2xl text-sm font-bold w-full sm:w-auto shadow-sm backdrop-blur-md"
                >
                  View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile View Modal */}
      {selectedUser && (
        <div 
          className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" 
          onClick={() => setSelectedUser(null)}
        >
          <div 
            className="relative w-full max-w-sm animate-slide-up" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute -top-14 right-0 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:rotate-90 transition-all duration-300 flex items-center justify-center z-50 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
            <div className="rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              <UserCard user={selectedUser} showActions={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections;