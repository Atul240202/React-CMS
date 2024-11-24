"use client";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "../firebase"; // Import the signIn utility function

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const slidingTextRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password); // Use Firebase sign-in function
      navigate("/dashboard"); // Redirect after successful login
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  useEffect(() => {
    const element = slidingTextRef.current;
    if (!element) return;

    const animateText = () => {
      element.style.transition = "transform 20s linear";
      element.style.transform = "translateX(0)";

      setTimeout(() => {
        element.style.transition = "none";
        element.style.transform = "translateX(100%)";

        setTimeout(() => {
          element.style.transition = "transform 20s linear";
          animateText();
        }, 50);
      }, 20000);
    };

    animateText();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black relative overflow-hidden">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center px-32 relative z-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-8 mr-12 ">
          Welcome Back
        </h1>
        <div className="backdrop-blur-md  bg-white/10 rounded-3xl p-8 max-w-md relative z-10 shadow-2xl border border-gray-600">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-1 text-left"
              >
                EMAIL ID
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1 text-left"
              >
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[2.5rem] text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Sliding Text Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div
          className="sliding-text absolute bottom-0 left-0 flex whitespace-nowrap text-[15rem] font-bold text-white opacity-50"
          style={{
            animation: "slide-text 20s linear infinite",
          }}
        >
          <span>GO PRODUCTIONS&nbsp;&nbsp;</span>
          <span>GO PRODUCTIONS&nbsp;&nbsp;</span>
        </div>
      </div>

      <style>
        {`
    @keyframes slide-text {
      0% {
        transform: translateX(0); /* Start from the initial position */
      }
      100% {
        transform: translateX(-100%); /* Move left by the full width */
      }
    }
  `}
      </style>

      {/* Right Section */}
      <div className="hidden lg:block lg:w-1/2 p-8 z-20">
        <img
          className="h-full w-full object-cover "
          src="https://res.cloudinary.com/da3r1iagy/image/upload/v1730482611/Frame_1000003530_oncgbk.png"
          alt="Couple on beach"
        />
      </div>
    </div>
  );
}
