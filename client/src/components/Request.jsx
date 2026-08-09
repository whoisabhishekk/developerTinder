import React, { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequest } from '../utils/requestSlice';

const Request = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center mt-20">
        <h1 className="text-2xl font-bold text-gray-200 mb-4 drop-shadow-sm">Connection Requests</h1>
        <p className="text-gray-400">No pending requests.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center my-10 px-4">
      <h1 className="text-3xl font-black text-white mb-8 tracking-tight drop-shadow-sm">
        Connection Requests ({requests.length})
      </h1>
      <div className="w-full max-w-2xl flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {requests.map((request, index) => {
          const { _id, fromUserId } = request;
          if (!fromUserId) return null; // Skip invalid requests
          const { firstName, lastName, photoUrl, age, gender, about } = fromUserId;
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
                <h2 className="text-xl sm:text-lg font-bold text-gray-100 tracking-tight mb-1">
                  {firstName} {lastName}
                </h2>
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
              <div className="flex gap-3 mt-4 sm:mt-0 sm:ml-auto w-full sm:w-auto">
                <button 
                  className="btn flex-1 sm:flex-none btn-outline border-white/20 text-gray-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 rounded-2xl text-sm font-bold shadow-sm backdrop-blur-md"
                  onClick={() => reviewRequest("rejected", _id)}
                >
                  Reject
                </button>
                <button 
                  className="btn flex-1 sm:flex-none bg-gradient-to-r from-primary to-secondary text-white border-0 hover:shadow-primary/30 rounded-2xl text-sm font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  onClick={() => reviewRequest("accepted", _id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Request;