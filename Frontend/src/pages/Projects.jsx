import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../API/axois';
import { useEffect } from "react";
import Projectlist from "../components/Projectlist";

const Projects = () => {

  const navigate=useNavigate();

  const [url,setUrl] =useState("");

  // 1.post url to backend 
  const handlesubmit= async(e) => {

    e.preventDefault();

    try{

        const res=await API.post("/api/analyzer/project",{projecturl:url});
        
        setUrl("");

        setProinfo(prev => {
              return [res.data.project, ...prev];
        });

        console.log("Url sent:", res.data);

    }catch(err){

      console.log("Full error:", err);
      console.log("Data:", err.response?.data);
      console.log("Response:", err.response);

    }
  }

  // 2.get details from backend 
  const [proinfo,setProinfo]=useState([]);

  const fetchDetails= async() => {
    try{
      const resData=await API.get("/api/analyzer/projects");
      setProinfo(resData.data.projects);

    }catch(err){
      console.log("Full error:", err);
      console.log("Data:", err.response?.data);
      console.log("Response:", err.response);
    }
  }

  useEffect( () => { // this for fetching when user open 
    fetchDetails()
  },[]);

  //3.delete button
  const handledelete= async(id) => {
      try{
        await API.delete(`/api/analyzer/${id}`);

        setProinfo(prev => prev.filter(c => c._id !== id));
      }catch(err){
        console.error("Delete error:", err);
      }
  }

  return (
    <div className="min-h-screen bg-[#040B1E] text-white">

      <section className="relative py-20">

        {/* Glow */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full" />
          <div className="absolute right-20 bottom-20 w-72 h-72 bg-purple-600/20 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-5xl font-bold">
              AI GitHub
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Project Analyzer
              </span>
            </h1>

            <p className="mt-4 text-slate-400 text-lg max-w-3xl mx-auto">
              Submit your GitHub repository and receive AI-powered insights,
              interview questions, resume suggestions, and detailed project analysis.
            </p>
          </div>

          {/* URL Input Card */}
          <div className="mt-12 bg-[#09142D] border border-blue-900/20 rounded-3xl p-8">

            <label className="block text-slate-300 mb-3">
              GitHub Repository URL
            </label>

            <div className="flex flex-col md:flex-row gap-4">

              <input
                type="text"
                name="projecturl"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="flex-1 px-5 py-4 rounded-xl bg-[#040B1E]
                border border-slate-700 text-white
                focus:border-blue-500 outline-none"
              />

              <button
                type="button"
                className="px-8 py-4 rounded-xl
                bg-gradient-to-r from-blue-600 to-purple-600
                hover:scale-105 active:scale-95
                transition-all duration-200"
                onClick={handlesubmit}
              >
                Analyze Project
              </button>

            </div>

          </div>

          {/* Quick Actions */}
          <div className="mt-10">

            <h2 className="text-2xl font-semibold mb-6">
              Quick Actions
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              <button
                type="button"
                className="p-6 rounded-2xl bg-[#09142D]
                border border-blue-900/20
                hover:border-blue-500
                hover:-translate-y-1
                transition-all duration-300"
                onClick={() => navigate("/interview-questions")}
              >
                🎯 Generate Interview Questions
              </button>

              <button
                type="button"
                className="p-6 rounded-2xl bg-[#09142D]
                border border-blue-900/20
                hover:border-blue-500
                hover:-translate-y-1
                transition-all duration-300"
                onClick={() => navigate("/resume-review")}
              >
                📄 Analyze Resume
              </button>

              <button
                type="button"
                className="p-6 rounded-2xl bg-[#09142D]
                border border-blue-900/20
                hover:border-blue-500
                hover:-translate-y-1
                transition-all duration-300"
                onClick={() => navigate("/Dashboard")}
              >
                📑 Download Report
              </button>

            </div>

          </div>

          {/* Project List Component Later */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">
              Recent Analyses
            </h2>

            {proinfo.length === 0 ? (
              <div className="bg-[#09142D] border border-blue-900/20 rounded-2xl p-8 text-center text-slate-400">
                No projects analyzed yet.
              </div>
            ) : (
              <Projectlist projectinfo={proinfo} deleteproject={handledelete} />
            )}

          </div>

        </div>
      </section>

    </div>
  );
};

export default Projects;;