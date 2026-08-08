import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import UserCard from './UserCard';

const EditProfile = () => {
  const user = useSelector((store) => store.user);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhotoUrl(user.photoUrl || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setAbout(user.about || "");
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );
      dispatch(addUser({ ...user, firstName, lastName, photoUrl, age, gender, about }));
      setSuccessMessage("Profile saved successfully!");
    } catch (error) {
      const errData = error.response?.data;
      if (typeof errData === "string") {
        setErrorMessage(errData);
      } else if (errData && typeof errData === "object" && errData.message) {
        setErrorMessage(errData.message);
      } else {
        setErrorMessage(error.message || "Failed to save profile.");
      }
    }
  };

  return (
    <div className="relative flex justify-center w-full px-4 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-10 w-full max-w-6xl mx-auto z-10 px-4">
        
        {/* Form Column */}
        <div className="w-full lg:max-w-xl flex-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card bg-gray-900/40 backdrop-blur-xl shadow-2xl shadow-black/50 border border-white/10 rounded-3xl z-10 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 px-8 py-6 border-b border-white/10">
              <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
                Edit Profile
              </h1>
              <p className="text-gray-300 text-sm mt-1 font-medium">
                Update your details to stand out in the community
              </p>
            </div>
            
            <div className="card-body px-8 py-8">
              <form className="space-y-5" onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* First Name */}
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xs font-bold text-gray-400 tracking-wide uppercase mb-1">
                      First Name
                    </legend>
                    <input
                      type="text"
                      value={firstName}
                      placeholder="Enter first name"
                      className="input w-full text-sm bg-[#1e293b] border-gray-700 text-white placeholder-gray-500 focus:bg-[#1e293b] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </fieldset>

                  {/* Last Name */}
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xs font-bold text-gray-400 tracking-wide uppercase mb-1">
                      Last Name
                    </legend>
                    <input
                      type="text"
                      value={lastName}
                      placeholder="Enter last name"
                      className="input w-full text-sm bg-[#1e293b] border-gray-700 text-white placeholder-gray-500 focus:bg-[#1e293b] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </fieldset>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Age */}
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xs font-bold text-gray-400 tracking-wide uppercase mb-1">
                      Age
                    </legend>
                    <input
                      type="number"
                      value={age}
                      placeholder="Enter your age"
                      min={18}
                      max={100}
                      className="input w-full text-sm bg-[#1e293b] border-gray-700 text-white placeholder-gray-500 focus:bg-[#1e293b] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </fieldset>

                  {/* Gender */}
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xs font-bold text-gray-400 tracking-wide uppercase mb-1">
                      Gender
                    </legend>
                    <select
                      value={gender}
                      className="select w-full text-sm bg-[#1e293b] border-gray-700 text-white focus:bg-[#1e293b] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="" disabled className="text-gray-500">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                  </fieldset>
                </div>

                {/* Photo URL */}
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs font-bold text-gray-400 tracking-wide uppercase mb-1">
                    Photo URL
                  </legend>
                  <input
                    type="url"
                    value={photoUrl}
                    placeholder="https://example.com/photo.jpg"
                    className="input w-full text-sm bg-[#1e293b] border-gray-700 text-white placeholder-gray-500 focus:bg-[#1e293b] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </fieldset>

                {/* About */}
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs font-bold text-gray-400 tracking-wide uppercase mb-1">
                    About
                  </legend>
                  <textarea
                    value={about}
                    placeholder="Tell us something interesting about yourself..."
                    className="textarea w-full text-sm bg-[#1e293b] border-gray-700 text-white placeholder-gray-500 focus:bg-[#1e293b] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl resize-none min-h-[100px]"
                    rows={4}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </fieldset>

                {/* Error Message */}
                {errorMessage && (
                  <p className="text-red-600 text-sm font-semibold text-center bg-red-50 p-3 rounded-xl border border-red-100 animate-fade-in">
                    {errorMessage}
                  </p>
                )}

                {/* Success Message */}
                {successMessage && (
                  <p className="text-green-600 text-sm font-semibold text-center bg-green-50 p-3 rounded-xl border border-green-100 animate-fade-in">
                    {successMessage}
                  </p>
                )}

                {/* Save Button */}
                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-primary to-secondary text-white w-full mt-4 text-sm font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-12"
                >
                  Save Profile
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="w-full lg:max-w-sm flex-shrink-0 animate-slide-up lg:sticky lg:top-28" style={{ animationDelay: '0.2s' }}>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">
              Live Preview
            </h3>
          </div>
          <div className="flex justify-center relative z-10">
            <UserCard 
              user={{ 
                firstName: firstName || 'First', 
                lastName: lastName || 'Last', 
                photoUrl, 
                age, 
                gender, 
                about: about || 'Your bio will appear here...' 
              }} 
              showActions={false} 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditProfile;