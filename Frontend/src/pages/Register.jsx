
import { Link } from "react-router-dom";
import { useState } from "react";
import API from '../API/axois.js';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate=useNavigate();

  // storing form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
 
   // geting from inputs 
  const handlechange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    })
  };

  const handlesubmit= async(e) => {

      e.preventDefault();

      try{

          if(formData.password !== formData.confirmpassword){
            alert("password not match");
            return;
          }

          const res =await API.post("/api/analyzer/register",formData);

          navigate("/login");

          setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmpassword: "",
          });

          console.log("User created:", res.data);

      }catch(err){
        console.log(err.response?.data);
        alert(err.response?.data?.message || err.response?.data?.error);
      }
  };

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
              Create Account
            </h1>

            <p className="text-slate-400 mt-3">
              Join AI GitHub Project Analyzer today
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handlesubmit}>

            <div>
              <label className="block text-slate-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handlechange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-[#040B1E]
                border border-slate-700 text-white
                focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handlechange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#040B1E]
                border border-slate-700 text-white
                focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handlechange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#040B1E]
                border border-slate-700 text-white
                focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmpassword"
                value={formData.confirmpassword}
                onChange={handlechange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#040B1E]
                border border-slate-700 text-white
                focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl
              bg-gradient-to-r from-blue-600 to-purple-600
              text-white font-semibold
              hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200"
            >
              Create Account
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-700"></div>
            <span className="px-4 text-slate-500 text-sm">OR</span>
            <div className="flex-1 border-t border-slate-700"></div>
          </div>

          {/* Google Button */}
          <button
            className="w-full py-3 rounded-xl border border-slate-700
            text-white hover:bg-slate-800 transition"
          >
            Continue with Google
          </button>

          {/* Login Link */}
          <p className="text-center text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300"
            >
              Login In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;