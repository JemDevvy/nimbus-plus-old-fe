import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import graphic from "../assets/Graphics2.png";
import Logo from "../assets/Logo-DarkText.png";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';


const Signup: React.FC = () => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  // Show Password
  const [showPassword, setShowPassword] = useState(false);

  // Form regEx
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Multi-step form state
  const [step, setStep] = useState(1);

  const next = () => setStep((prev) => prev + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    } else if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }
    if (!fullName) {
      setError("Full name is required");
      return;
    }
    if (!selected) {
      setError("Role is required");
      return;
    }
    try {
      // 1. Create user
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          username: email,
          role: "admin",
          discipline,
          position: selected,
          company,
          mobileNumber,
          sources: selectedSources,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }
      // 2. Auto-login
      const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setError(loginData.message || "Login after signup failed");
        return;
      }
      localStorage.setItem("token", loginData.token);
      localStorage.removeItem('selectedProject');
      setUser(loginData.user);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  // Roles choice chips
   const positions = [
    "Architect",
    "Engineer",
    "Director",
    "Consultant",
    "Project Manager",
    "Builder",
    "Other",
  ];

  const [selected, setSelected] = useState("");
  const [fullName, setFullName] = useState("");

  // Sources choice chips
  const sources = [
    "Online Search Engine (e.g. Google, Bing, etc.)",
    "Facebook/Instagram",
    "Youtube",
    "Friend",
    "LinkedIn",
    "AI Chatbots (e.g. ChatGPT, Claude, etc.)",
    "Other",
  ];

  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const toggleSource = (src) => {
    if (selectedSources.includes(src)) {
      setSelectedSources(selectedSources.filter((s) => s !== src));
    } else {
      setSelectedSources([...selectedSources, src]);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
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


        {/* Email Input Step */}
        {step === 1 && (
        <div className="flex flex-col items-center justify-start w-full md:w-[30vw] mx-auto py-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to Nimbus+
          </h2>
          <p className="text-sm text-gray-500 mb-6">
          Get started for free - No credit card required
          </p>
          <div className="mb-5 w-full">
            <button
              className="flex items-center justify-center gap-2 border-1 border-gray-200 rounded-lg py-3 w-full mb-4 shadow-sm hover:bg-gray-50"
              type="button"
              onClick={handleGoogleLogin}
            >
              <FcGoogle className="text-xl" />
              <span className="text-md font-semibold text-gray-700">
                Sign Up with Google
              </span>
            </button>
          </div>


          <div className="flex items-center w-full mb-4">
            <div className="flex-grow border-t border-gray-800"></div>
              <span className="px-3 text-sm">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                Or
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>

          <div className="w-full">
            <label className="text-sm font-semibold text-gray-600">EMAIL</label>
            <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-brand-whiteback border-1 border-gray-300 rounded-lg px-4 py-2 mb-4 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button type="submit" className="w-full bg-brand-primary hover:bg-blue-700 text-white rounded-lg py-3 text-md font-bold cursor-pointer" onClick={next}>
            Continue
            </button>
          </div>

          <p className="mt-auto text-sm text-gray-500 text-center">
          Already have an account?&nbsp;&nbsp;
            <Link to='/login' className="text-brand-primary font-semibold hover:underline">
            Log in
            </Link>
          </p>
        </div>
        )}

        {/* Password Input Step */}
        {step === 2 && (
          <div className="flex flex-col justify-start w-full md:w-[30vw] mx-auto py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Enter your password
            </h2>
            <div className="bg-brand-whiteback py-4 px-6 mb-6 rounded-lg">
              <p className="text-sm text-gray-500">
              Must contain: <br />
              - at least <b>8 characters</b> <br />
              - an uppercase letter (A-Z) <br />
              - a lowercase letter (a-z)<br />
              - a number (0-9)<br />
              - a special character (e.g. !@#$%^&*) 
              </p>
            </div>

            <div className="w-full">
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
            </div>

              {/* <label className="text-sm text-gray-600">MOBILE NUMBER</label>
              <input
                type="tel"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value)}
                className="w-full bg-brand-whiteback border-1 border-gray-300 rounded-lg px-4 py-2 mb-4 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="text-sm text-gray-600">COMPANY</label>
              <input
                type="text"
                placeholder="Enter your company name"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full bg-brand-whiteback border-1 border-gray-300 rounded-lg px-4 py-2 mb-4 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}

            <button type="button" className="w-1/3 ml-auto bg-brand-primary hover:bg-blue-700 text-white rounded-lg py-3 text-md font-bold cursor-pointer" onClick={next}>
            Next
            </button>

            <p className="mt-auto text-sm text-gray-500 text-center">
              Already have an account?&nbsp;&nbsp;
              <Link to='/login' className="text-brand-primary font-semibold hover:underline">
              Log in
              </Link>
            </p>
          </div>
        )}

        {/* Name, Discipline, Position Step */}
        {step === 3 && (
          <div className="flex flex-col justify-start w-full md:w-[30vw] mx-auto py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Next, what's your name?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
            Enter your name and details so people know it's you
            </p>

            <div className="w-full">
              <label className="text-sm text-gray-600">FULL NAME</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-brand-whiteback border-1 border-gray-300 rounded-lg px-4 py-2 mb-4 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* <label className="text-sm text-gray-600">DISCIPLINE</label>
              <input
                type="text"
                placeholder="e.g. Architect, Engineer, etc."
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full bg-brand-whiteback border-1 border-gray-300 rounded-lg px-4 py-2 mb-4 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-600">POSITION</label>
              <input
                type="text"
                placeholder="e.g. Senior, Junior, Director, etc."
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-brand-whiteback border-1 border-gray-300 rounded-lg px-4 py-2 mb-4 text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}
            </div>

            <button type="button" className="w-1/3 ml-auto bg-brand-primary hover:bg-blue-700 text-white rounded-lg py-3 text-md font-bold cursor-pointer" onClick={next}>
            Next
            </button>

            <p className="mt-auto text-sm text-gray-500 text-center">
              Already have an account?&nbsp;&nbsp;
              <Link to='/login' className="text-brand-primary font-semibold hover:underline">
              Log in
              </Link>
            </p>
          </div>
        )}
        
        {/* Role Selection Step */}
        {step === 4 && (
          <div className="flex flex-col justify-start w-full md:w-[30vw] mx-auto py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
            What best describes your current role?
            </h2>

            <div className="w-full mt-3">
              <div className="flex flex-wrap gap-3">
                {positions.map((position) => (
                  <button
                    key={position}
                    onClick={() => setSelected(position)}
                    className={`px-6 py-2 rounded-lg border transition cursor-pointer
                      ${
                        selected === position
                          ? "bg-brand-primary text-white border-blue-600"
                          : "bg-brand-whiteback text-gray-700 border-gray-300 hover:bg-blue-100"
                      }`}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="w-1/3 mt-10 ml-auto bg-brand-primary hover:bg-blue-700 text-white rounded-lg py-3 text-md font-bold cursor-pointer" onClick={next}>
            Next
            </button>

            <p className="mt-auto text-sm text-gray-500 text-center">
              Already have an account?&nbsp;&nbsp;
              <Link to='/login' className="text-brand-primary font-semibold hover:underline">
              Log in
              </Link>
            </p>
          </div>
        )}

        {/* Source Selection Step */}
        {step === 5 && (
          <div className="flex flex-col justify-start w-full md:w-[30vw] mx-auto py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Lastly, where did you hear about us?
            </h2>

            <div className="w-full mt-3">
              <div className="flex flex-wrap gap-2">
                {sources.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleSource(option)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition w-fit
                      ${
                        selectedSources.includes(option)
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <span
                      className={`w-4 h-4 flex items-center justify-center rounded border 
                        ${
                          selectedSources.includes(option)
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-400 bg-white"
                        }`}
                    >
                      {selectedSources.includes(option) && (
                        <span>✓</span>
                      )}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="w-1/3 mt-10 ml-auto bg-brand-primary hover:bg-blue-700 text-white rounded-lg py-3 text-md font-bold cursor-pointer" onClick={handleSubmit}>
            Finish
            </button>

            <p className="mt-auto text-sm text-gray-500 text-center">
              Already have an account?&nbsp;&nbsp;
              <Link to='/login' className="text-brand-primary font-semibold hover:underline">
              Log in
              </Link>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Signup;
