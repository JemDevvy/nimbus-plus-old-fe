import React, { useEffect, useState } from "react";
import graphic from "../assets/Graphics2.png";
import Logo from "../assets/Logo-DarkText.png";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';

const Login: React.FC = () => {
    const auth = useAuth();
    const setUser = auth?.setUser;
    const setAccessToken = auth?.setAccessToken;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const next = () => setStep((prev) => prev + 1);

    // Handle token from redirect (must be after hooks)
    React.useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (!token) return;
      localStorage.setItem("token", token);
      setAccessToken?.(token);
      // Optionally fetch user info from backend
      fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setUser?.(data);
          navigate("/dashboard");
        })
        .catch(() => {
          setError("Failed to fetch user info.");
        });
    }, [setAccessToken, setUser, navigate]);

    // useEffect
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      credentials: "include",
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(user => {
        setUser(user);
        navigate("/dashboard");
      })
      .catch(() => console.log("No session cookie found"));
  }, []);


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "Invalid credentials");
          return;
        }
        const data = await res.json();
        setAccessToken?.(data.token);
        setUser?.(data.user);
        localStorage.removeItem("selectedProject");
        document.cookie = `auth_token=${data.token}; path=/; secure; samesite=lax`;
        // Save token to localStorage
        // localStorage.setItem("token", data.token);
        // localStorage.removeItem('selectedProject');
        // setAccessToken(data.token); // <-- Add this line
        // setUser(data.user);
        navigate("/dashboard");
      } catch (err) {
        setError("Login failed. Please try again." );
      }
    };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const getGoogleAuthUrl = () => {
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
    const redirectUri = `${import.meta.env.VITE_API_URL}/api/auth/google/callback`;
    const scope = "openid email profile";
    return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=select_account`;
  };

    
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-brand-primary/20 to-40% to-white overflow-x-clip">
        <div className="flex w-full h-full p-6">
          <div className="mt-10 ml-10 absolute">
            <img
                src={Logo}
                alt="Description"
                className="h-16 object-contain pr-2 sm:pr-0"
            />
          </div>

          <div className="hidden md:flex flex-col justify-center items-center w-1/2">
            <img
            src={graphic}
            alt="illustration"
            className="h-[70vh]"
            />
          </div>

          {/* Email Address */}
          {step === 1 && (
          <div className="flex flex-col items-center justify-start w-full md:w-[30vw] mx-auto py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Log in to your account
            </h2>
            <p className="text-sm text-gray-500 mb-6">
            Enter your work email address
            </p>

            <div className="mb-5 w-full">
              <button
                className="flex items-center justify-center gap-2 border-1 border-gray-200 rounded-lg py-3 w-full mb-4 shadow-sm hover:bg-gray-50"
                type="button"
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="text-xl" />
                <span className="text-md font-semibold text-gray-700">
                  Sign in with Google
                </span>
              </button>
            </div>

            <div className="flex items-center w-full mb-4">
              <div className="flex-grow border-t border-gray-800"></div>
                <span className="px-3 text-sm">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                  or sign in with 
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            <form action="" className="w-full" onSubmit={e => { e.preventDefault(); next(); }}>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            
            <label className="text-sm text-gray-600">EMAIL</label>
            <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-brand-whiteback border-1 border-gray-300 rounded-lg px-4 py-2 mb-4 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button className="w-full bg-brand-primary hover:bg-blue-700 text-white rounded-lg py-3 text-md font-bold cursor-pointer">
            Continue
            </button>
            </form>

            <p className="mt-auto text-sm text-gray-500 text-center">
            Don’t have an account?&nbsp;&nbsp;
              <Link to='/signup' className="text-brand-primary font-semibold hover:underline">
              Sign up
              </Link>
            </p>
          </div>
          )}

          {/* Password */}
          {step === 2 && (
            <div className="flex flex-col items-center justify-start w-full md:w-[30vw] mx-auto py-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Log in to your account
              </h2>
              <p className="text-sm text-gray-500 mb-6">
              </p>

              <form action="" className="w-full mb-6" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
              
              <label className="text-sm text-gray-600">PASSWORD</label>
              <div className="w-full flex flex-row justify-between bg-brand-whiteback border-1 border-gray-300 rounded-lg px-4 py-2 mb-4 text-md">
              <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full focus:outline-none"
              // autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className=" text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
              </button>
              </div>

              <button type="submit" className="w-full bg-brand-primary hover:bg-blue-700 text-white rounded-lg py-3 text-md font-bold cursor-pointer">
              Log In
              </button>
              </form>
              
              <p className="text-sm text-gray-500 mb-4 ml-auto text-right">
                <Link to='' className="text-gray-400 italic hover:underline">
                Forgot your password?
                </Link>
              </p>
            
              <p className="mt-auto text-sm text-gray-500 text-center">
              Don’t have an account?&nbsp;&nbsp;
                <Link to='/signup' className="text-brand-primary font-semibold hover:underline">
                Sign up
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    );
};

export default Login;
