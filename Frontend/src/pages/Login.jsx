import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import API from '../API/axois.js';
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate=useNavigate();

  const [logindata,setLogindata]=useState({
    email:" ",
    password:""
  });

  const handleLogchange=(e) => {
      setLogindata({
        ...logindata,
        [e.target.name]:e.target.value
      });
  }

  const handleLogsubmit= async(e) => {

    e.preventDefault();

    try{

     const res=await API.post("/api/analyzer/login",logindata);
     console.log(res.data);

     localStorage.setItem("user",JSON.stringify(res.data.user));

     navigate("/Projects");

     setLogindata({
       email:" ",
       password:""
     })

     console.log("User created:", res.data);

    }catch(err){

      console.log(err.response?.data);
      alert(err.response?.data?.message || err.response?.data?.error);

    }
  }

  return (
    <div className="min-h-screen bg-[#040B1E] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Card */}
        <div className="bg-[#09142D]/90 backdrop-blur-lg border border-blue-900/20 rounded-3xl p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>

            <p className="text-slate-400 mt-3">
              Sign in to continue your AI-powered journey
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5"  onSubmit={handleLogsubmit}>

            <div>
              <label className="block text-slate-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={logindata.email}
                onChange={handleLogchange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#040B1E]
                border border-slate-700 text-white
                focus:outline-none focus:border-blue-500
                transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={logindata.password}
                onChange={handleLogchange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#040B1E]
                border border-slate-700 text-white
                focus:outline-none focus:border-blue-500
                transition"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-slate-400">
                <input
                  type="checkbox"
                  className="accent-blue-500"
                />
                Remember Me
              </label>

              <button
                type="button"
                className="text-blue-400 hover:text-blue-300"
              >
                Forgot Password?
              </button>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl
              bg-gradient-to-r from-blue-600 to-purple-600
              text-white font-semibold
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200"
            >
              Sign In
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-700"></div>
            <span className="px-4 text-slate-500 text-sm">OR</span>
            <div className="flex-1 border-t border-slate-700"></div>
          </div>

          {/* Google Login */}
          <GoogleLogin onSuccess={async(credentialResponse) => {

                 const res= await API.post("/api/auth/google",{
                       credential:credentialResponse.credential
                  });
                  
                  if (res.data.success) {
                     localStorage.setItem(
                        "user",
                        JSON.stringify(res.data.user)
                      );
                      navigate("/Projects");
                  }
          }}

          onError={() => {
            console.log("Login First")
          }}
          />

          {/* Register Link */}
          <p className="text-center text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;