import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (error) {
      if (error.response?.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      
      setSuccessMessage("Account created! Please log in.");
      setIsLoginForm(true);
      setFirstName("");
      setLastName("");
      setPassword("");
      
    } catch (error) {
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          setErrorMessage(error.response.data);
        } else if (error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Signup failed. Please try again.");
        }
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden px-4 py-8">
      <div className="flex flex-col items-center gap-8 z-10 w-full max-w-md animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {/* App Logo */}
        <div className="text-center cursor-default group">
          <h1 className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(99,102,241,0.5)] tracking-tight group-hover:scale-105 transition-transform duration-300">
            DevTinder
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-2 tracking-[0.2em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">
            Where developers connect
          </p>
        </div>

        <div className="card bg-gray-900/40 backdrop-blur-xl w-full shadow-2xl shadow-black/50 border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(99,102,241,0.3)] hover:border-white/20">
        <div className="card-body px-7 py-8">
          {/* Header */}
          <div className="text-center mb-2">
            <h1 className="text-3xl font-extrabold text-white leading-tight drop-shadow-sm">
              {isLoginForm ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-400 text-sm mt-1.5">
              {isLoginForm ? "Sign in to continue to DevTinder" : "Join the developer community"}
            </p>
          </div>

          {/* Form */}
          <form className="mt-2" onSubmit={isLoginForm ? handleLogin : handleSignup}>
            
            {!isLoginForm && (
              <div className="flex gap-2">
                {/* First Name */}
                <fieldset className="fieldset flex-1">
                  <legend className="fieldset-legend text-sm font-medium text-gray-400">
                    First Name
                  </legend>
                  <label className="input w-full flex items-center gap-2 bg-[#1e293b] border-gray-700 text-white focus-within:bg-[#1e293b] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <input
                      type="text"
                      value={firstName}
                      className="grow bg-transparent outline-none text-sm placeholder-gray-500"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </label>
                </fieldset>

                {/* Last Name */}
                <fieldset className="fieldset flex-1">
                  <legend className="fieldset-legend text-sm font-medium text-gray-400">
                    Last Name
                  </legend>
                  <label className="input w-full flex items-center gap-2 bg-[#1e293b] border-gray-700 text-white focus-within:bg-[#1e293b] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <input
                      type="text"
                      value={lastName}
                      className="grow bg-transparent outline-none text-sm placeholder-gray-500"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </label>
                </fieldset>
              </div>
            )}

            {/* Email */}
            <fieldset className={`fieldset ${!isLoginForm ? 'mt-3' : ''}`}>
              <legend className="fieldset-legend text-sm font-medium text-gray-400">
                Email
              </legend>
              <label className="input w-full flex items-center gap-2 bg-[#1e293b] border-gray-700 text-white focus-within:bg-[#1e293b] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-500 shrink-0"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input
                  type="email"
                  value={emailId}
                  className="grow bg-transparent outline-none text-sm placeholder-gray-500"
                  onChange={(e) => setEmailId(e.target.value)}
                />
              </label>
            </fieldset>

            {/* Password */}
            <fieldset className="fieldset mt-3">
              <legend className="fieldset-legend text-sm font-medium text-gray-400">
                Password
              </legend>
              <label className="input w-full flex items-center gap-2 bg-[#1e293b] border-gray-700 text-white focus-within:bg-[#1e293b] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-500 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  className="grow bg-transparent outline-none text-sm placeholder-gray-500"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                         fillRule="evenodd"
                         d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                         clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </label>
            </fieldset>

            {/* Remember me & Forgot - Only show in Login mode */}
            {isLoginForm && (
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-xs border-slate-300"
                  />
                  <span className="text-xs text-gray-400">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-xs text-primary hover:text-primary-focus hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Success Message Display */}
            {successMessage && (
              <p className="text-green-400 text-xs font-semibold text-center mt-3 bg-green-500/10 p-2 rounded-lg border border-green-500/20 backdrop-blur-sm">
                {successMessage}
              </p>
            )}

            {/* Error Message Display */}
            {errorMessage && (
              <p className="text-red-400 text-xs font-semibold text-center mt-3 bg-red-500/10 p-2 rounded-lg border border-red-500/20 backdrop-blur-sm">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn bg-gradient-to-r from-primary to-secondary text-white border-0 w-full mt-5 text-sm font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoginForm ? "Login" : "Sign up"}
            </button>
          </form>

          {/* Toggle Link */}
          <p className="text-center text-xs text-gray-400 mt-4">
            {isLoginForm ? "Don't have an account?" : "Already have an account?"} {" "}
            <span 
              className="text-primary font-bold hover:text-primary-focus hover:underline cursor-pointer transition-colors"
              onClick={() => {
                setIsLoginForm(!isLoginForm);
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              {isLoginForm ? "Sign up for free" : "Log in"}
            </span>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
