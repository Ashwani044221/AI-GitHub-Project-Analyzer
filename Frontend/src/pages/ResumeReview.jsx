import API from '../API/axois';
import { useState,useEffect } from "react";
import { Upload, FileText, Sparkles } from "lucide-react";

const ResumeReview = () => {
  const [file, setFile] = useState(null);
  const [resume,setResume]=useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  // post resuem
  const handlesubmit= async() => {
    try{
      if(!file){
        alert("Please select a resume.");
        return;
      }

      const formdata=new FormData(); // this convert file into readable form for browser 

      formdata.append("resume",file); // "resume" is for backend like we do name:email then in use in backend email=req.body 

      const res=await API.post("/api/resume/upload",formdata ,{
              headers:{
              "Content-Type":"multipart/form-data"
              }
      });

      setResume(res.data.resume);
      alert("Button Clicked");

    }catch(err){

      console.log(err);

    }
  }

  // read resume
  const handlefetch= async() => {
    try{

      const res=await API.get("/api/resume");

      setResume(res.data.resume);
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    handlefetch();
  }, []); 

  return (
   <div className="min-h-screen bg-slate-950 text-white">

  {/* Header */}

  <div className="max-w-6xl mx-auto px-6 py-10">

    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold">
        AI Resume Review
      </h1>

      <p className="text-slate-400 mt-3">
        Upload your resume and receive professional AI feedback,
        ATS score, improvements and interview questions.
      </p>
    </div>

    {/* Upload Card */}

    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10">

      <div className="flex flex-col items-center">

        <Upload size={55} className="text-green-400 mb-5" />

        <h2 className="text-2xl font-semibold">
          Upload Resume
        </h2>

        <p className="text-slate-400 mt-2 mb-6">
          PDF files only
        </p>

        <label className="cursor-pointer bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition">
          Choose Resume

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleChange}
          />
        </label>

        {file && (
          <div className="mt-6 flex items-center gap-3 text-green-400">
            <FileText />
            <span>{file.name}</span>
          </div>
        )}

        <button
          className="mt-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg transition"
          onClick={handlesubmit}
        >
          <Sparkles size={20} />
          Analyze Resume
        </button>

      </div>
    </div>

    {/* Analysis */}

    <div className="mt-12 grid md:grid-cols-3 gap-6">

      {/* ATS */}

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">

        <h3 className="text-lg font-semibold">
          ATS Score
        </h3>

        <p className="text-5xl mt-4 font-bold text-green-400">
          {resume?.ATSScore || "--"}
        </p>

      </div>

      {/* Strengths */}

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">

        <h3 className="text-lg font-semibold mb-4">
          Strengths
        </h3>

        <ul className="space-y-2 text-slate-300">

          {resume?.strengths?.length ? (

            resume.strengths.map((item, index) => (

              <li key={index}>• {item}</li>

            ))

          ) : (

            <li>No strengths available.</li>

          )}

        </ul>

      </div>

      {/* Weaknesses */}

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">

        <h3 className="text-lg font-semibold mb-4">
          Weaknesses
        </h3>

        <ul className="space-y-2 text-slate-300">

          {resume?.weaknesses?.length ? (

            resume.weaknesses.map((item, index) => (

              <li key={index}>• {item}</li>

            ))

          ) : (

            <li>No weaknesses available.</li>

          )}

        </ul>

      </div>

    </div>

    {/* Summary */}

    <div className="bg-slate-900 border border-slate-800 rounded-xl mt-8 p-6">

      <h2 className="text-2xl font-semibold mb-4">
        Professional Summary
      </h2>

      <p className="text-slate-300 leading-7">
        {resume?.summary || "No summary available."}
      </p>

    </div>

    {/* Missing Skills */}

    <div className="bg-slate-900 border border-slate-800 rounded-xl mt-8 p-6">

      <h2 className="text-2xl font-semibold mb-4">
        Missing Skills
      </h2>

      <ul className="space-y-2 text-slate-300">

        {resume?.missingSkills?.length ? (

          resume.missingSkills.map((item, index) => (

            <li key={index}>• {item}</li>

          ))

        ) : (

          <li>No missing skills.</li>

        )}

      </ul>

    </div>

    {/* Suggestions */}

    <div className="bg-slate-900 border border-slate-800 rounded-xl mt-8 p-6">

      <h2 className="text-2xl font-semibold mb-4">
        Improvement Suggestions
      </h2>

      <ul className="space-y-2 text-slate-300">

        {resume?.improvements?.length ? (

          resume.improvements.map((item, index) => (

            <li key={index}>• {item}</li>

          ))

        ) : (

          <li>No suggestions available.</li>

        )}

      </ul>

    </div>

    {/* Interview Questions */}

    <div className="bg-slate-900 border border-slate-800 rounded-xl mt-8 p-6">

      <h2 className="text-2xl font-semibold mb-4">
        Interview Questions
      </h2>

      <ol className="list-decimal pl-5 space-y-3 text-slate-300">

        {resume?.interviewQuestions?.length ? (

          resume.interviewQuestions.map((item, index) => (

            <li key={index}>{item}</li>

          ))

        ) : (

          <li>No interview questions available.</li>

        )}

      </ol>

    </div>

  </div>

 </div>
)
};

export default ResumeReview;