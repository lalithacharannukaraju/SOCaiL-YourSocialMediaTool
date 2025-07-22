/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css"; // Importing the CSS file for animation

function LoginForm({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false); // State to trigger the animation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/auth/${isRegistering ? "register" : "login"}`,
        {
          email,
          password,
          rememberMe,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        console.log(response.data);
        const { token } = response.data;
        if (!isRegistering) {
          onLogin(token);
          navigate("/dashboard");
        } else {
          setIsRegistering(false);
          setError("Registration successful! Please login.");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred while connecting to the server"
      );
    }
  };

  // Trigger the animation when the component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[5%] h-[300px] w-[300px] rounded-full bg-purple-100 mix-blend-multiply filter blur-3xl opacity-70" />
        <div className="absolute right-[15%] top-[15%] h-[250px] w-[250px] rounded-full bg-pink-100 mix-blend-multiply filter blur-3xl opacity-70" />
        <div className="absolute left-[20%] bottom-[10%] h-[350px] w-[350px] rounded-full bg-blue-100 mix-blend-multiply filter blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div
          className={`max-w-md w-full bg-white rounded-lg border-2 border-purple-500/35 hover:shadow-purple-500/50 hover:shadow-lg transition-shadow duration-300 ${
            isMounted ? "animate-rise" : ""
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-center mb-8">
              <h1 className="text-2xl font-bold text-purple-600">SOCaiL</h1>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {isRegistering ? "Create an Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 mb-6">
              {isRegistering
                ? "Please fill in your details to register."
                : "Please sign in to your account"}
            </p>

            {error && <div className="mb-4 text-red-600">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {isRegistering && (
                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="rememberMe" className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="mr-2"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Remember Me
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-bold py-2 rounded-md hover:bg-purple-700 transition duration-300"
              >
                {isRegistering ? "Register" : "Login"}
              </button>
            </form>

            <p className="mt-4 text-center">
              {isRegistering ? (
                <span>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsRegistering(false)}
                    className="text-purple-600 hover:underline"
                  >
                    Login here
                  </button>
                </span>
              ) : (
                <span>
                  Do not have an account?{" "}
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="text-purple-600 hover:underline"
                  >
                    Register here
                  </button>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
