import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../API/axois";
import Projectlist from "../components/Projectlist";

const Dashboard = () => {
  const location = useLocation();
  const projectId = location.state?.projectId;

  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ===============================
  // Fetch All Projects
  // ===============================

  const fetchProjects = async () => {
    try {
      const res = await API.get("/api/analyzer/projects");
      
      setProjects(res.data.projects);

      if (res.data.projects.length === 0) {
         setProject(null);
         setAnalysis(null);
         localStorage.removeItem("selectedProjectId");
      }

    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // Fetch Single Project
  // ===============================

  const fetchProjectDetails = async (projectId,isInitial = false) => {
    
    if (isInitial) {
        setLoading(true);
    }

    if (!projectId) return false;

  try {
    setLoading(true);

    localStorage.setItem("selectedProjectId", projectId);

    const res = await API.get(`/api/analyzer/project/${projectId}`);

    setProject(res.data.project);
    setAnalysis(res.data.analysis);

    const done = res.data.project.aiStatus === "completed";

    if (done) {
      setShowPopup(false);
    } else {
      setShowPopup(true);
    }

    await fetchProjects();

    setLoading(false);

    return done;

  } catch (err) {
    console.log(err);
    setLoading(false);
    return false;
  }
 };

  // ===============================
  // Delete Project
  // ===============================

  const retryAnalysis = async () => {
    try {

    await API.post(
      `/api/analyzer/project/${project._id}/retry`
    );

    setAnalysis(null);

    setProject(prev => ({
      ...prev,
      aiStatus: "processing"
    }));

   } catch (err) {

    console.log(err);

   }
  };

  const handledelete = async (id) => {
    try {
      await API.delete(`/api/analyzer/${id}`);

      setProjects((prev) => prev.filter((item) => item._id !== id));

      if (project?._id === id) {
        setProject(null);
        setAnalysis(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // Initial Load
  // ===============================

  useEffect(() => {
    fetchProjects();
  }, []);

  // ===============================
  // Restore Selected Project
  // ===============================

  useEffect(() => {  // undersatnd it 
  const selectedId =
    projectId || localStorage.getItem("selectedProjectId");

  if (!selectedId) return;

  fetchProjectDetails(selectedId);

  const interval = setInterval(async () => {
    const done = await fetchProjectDetails(selectedId);

    if (done) {
      clearInterval(interval);
    }
  }, 5000);

  return () => clearInterval(interval);
  }, [projectId]);

  return (
    <div className="min-h-screen bg-[#020817] text-white">

      {showPopup && (

         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
         
           <div className="bg-[#081222] border border-slate-700 rounded-xl p-8 w-[450px]">
         
             <div className="text-center">
         
               <div className="text-5xl mb-5">
                 🤖
               </div>
         
               <h2 className="text-2xl font-bold">
                 AI Analysis Started
               </h2>
         
               <p className="text-slate-300 mt-5 leading-7">
         
                 Your GitHub project has been added successfully.
         
                 <br /><br />
         
                 AI is now analyzing your repository.
         
                 <br />
         
                 The dashboard will update automatically when the report is ready.
         
               </p>
         
               <div className="flex justify-center mt-8">
         
                 <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
         
               </div>
         
             </div>
         
           </div>
         
         </div>

      )}

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-10">
          AI GitHub Dashboard
        </h1>

        {/* ================= Dashboard Cards ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="bg-[#081222] border border-slate-700 rounded-xl p-6">

            <p className="text-slate-400 text-sm">
              Total Projects
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {projects.length}
            </h2>

          </div>

          <div className="bg-[#081222] border border-slate-700 rounded-xl p-6">

            <p className="text-slate-400 text-sm">
              AI Reports
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {projects.length}
            </h2>

          </div>

          <div className="bg-[#081222] border border-slate-700 rounded-xl p-6">

            <p className="text-slate-400 text-sm">
              Developer Level
            </p>

            <h2 className="text-3xl font-bold mt-3 text-blue-400">

              {analysis?.skillGap?.overallLevel || "--"}

            </h2>

          </div>

          <div className="bg-[#081222] border border-slate-700 rounded-xl p-6">

            <p className="text-slate-400 text-sm">
              Project Score
            </p>

            <h2 className="text-4xl font-bold mt-3 text-green-400">

              {analysis?.score ?? "--"}

            </h2>

          </div>

        </div>

        {/* ================= Layout ================= */}

        <div className="grid grid-cols-12 gap-8">

          {/* LEFT PANEL */}

          <div className="col-span-12 lg:col-span-4">

            <Projectlist
              projectinfo={projects}
              onSelectProject={fetchProjectDetails}
              deleteproject={handledelete}
            />

          </div>

          {/* RIGHT PANEL */}

          <div className="col-span-12 lg:col-span-8">

            {loading ? (

              <div className="bg-[#081222] rounded-xl p-12 text-center">

                Loading Project...

              </div>

            ) : !project ? (

              <div className="bg-[#081222] rounded-xl p-12 text-center">

                Select a project to view AI analysis.

              </div>

            ) : (

              <div className="bg-[#081222] border border-slate-700 rounded-xl p-8">

                <h2 className="text-3xl font-bold">
                  {project.name}
                </h2>

                <p className="text-slate-300 mt-4">
                  {project.description}
                </p>

                <div className="grid grid-cols-2 gap-5 mt-8">

                  <div>
                    <p className="text-slate-400">
                      Language
                    </p>

                    <p className="font-semibold">
                      {project.language}
                    </p>
                  </div>

                  <div>

                    <p className="text-slate-400">
                      Stars
                    </p>

                    <p className="font-semibold">

                      ⭐ {project.stars}

                    </p>

                  </div>

                  <div>

                    <p className="text-slate-400">
                      Forks
                    </p>

                    <p className="font-semibold">

                      {project.forks}

                    </p>

                  </div>

                </div>

                <hr className="my-8 border-slate-700" />

                    {/* ================= AI Status ================= */}
                
                <h2 className="text-2xl font-semibold mt-8">
                  AI Status
                </h2>
                
                <div className="mt-4">
                
                  {project.aiStatus === "processing" && (
                
                    <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-5">
                
                      ⏳ AI is generating the report.This usually takes 10–30 seconds.
                
                    </div>
                
                  )}
                
                  {project.aiStatus === "completed" && (
                
                    <div className="bg-green-900/20 border border-green-600 rounded-lg p-5">
                
                      ✅ AI Analysis Completed
                
                    </div>
                
                  )}
                
                  {project.aiStatus === "failed" && (
                
                    <div className="bg-red-900/20 border border-red-600 rounded-lg p-5">
                
                      {project.aiStatus === "failed" && (

                        <div className="bg-red-900/20 border border-red-600 rounded-lg p-5">
                      
                          <p>
                            ❌ AI generation failed.
                          </p>
                      
                          <button
                            onClick={retryAnalysis}
                            className="mt-4 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
                          >
                      
                            Retry Analysis
                      
                          </button>
                      
                        </div>

                      )}
                
                    </div>
                
                  )}
                
                </div>

                <hr className="my-8 border-slate-700" />
                                {/* ================= Score Reason ================= */}

                <h2 className="text-2xl font-semibold">
                  Score Reason
                </h2>

                <div className="mt-4 bg-slate-900 border border-slate-700 rounded-lg p-5">

                  <p className="text-slate-300 leading-7">

                    {analysis?.scoreReason || "No score available."}

                  </p>

                </div>

                {/* ================= Summary ================= */}

                <h2 className="text-2xl font-semibold mt-10">
                  AI Summary
                </h2>

                <div className="mt-4 bg-slate-900 border border-slate-700 rounded-lg p-5">

                  <p className="text-slate-300 leading-7">

                    {analysis?.summary || "No summary available."}

                  </p>

                </div>

                {/* ================= Strengths ================= */}

                <h2 className="text-2xl font-semibold mt-10">

                  Strengths

                </h2>

                <div className="mt-4 space-y-3">

                  {analysis?.strengths?.length > 0 ? (

                    analysis.strengths.map((item, index) => (

                      <div
                        key={index}
                        className="bg-green-900/20 border border-green-700 rounded-lg p-4"
                      >

                        <div className="flex items-start gap-3">

                          <span className="text-green-400 text-lg">
                            ✔
                          </span>

                          <p className="text-slate-200">
                            {item}
                          </p>

                        </div>

                      </div>

                    ))

                  ) : (

                    <p className="text-slate-400">

                      No strengths found.

                    </p>

                  )}

                </div>

                {/* ================= Weaknesses ================= */}

                <h2 className="text-2xl font-semibold mt-10">

                  Weaknesses

                </h2>

                <div className="mt-4 space-y-3">

                  {analysis?.weaknesses?.length > 0 ? (

                    analysis.weaknesses.map((item, index) => (

                      <div
                        key={index}
                        className="bg-red-900/20 border border-red-700 rounded-lg p-4"
                      >

                        <div className="flex items-start gap-3">

                          <span className="text-red-400 text-lg">
                            ✖
                          </span>

                          <p className="text-slate-200">

                            {item}

                          </p>

                        </div>

                      </div>

                    ))

                  ) : (

                    <p className="text-slate-400">

                      No weaknesses found.

                    </p>

                  )}

                </div>

                {/* ================= Improvements ================= */}

                <h2 className="text-2xl font-semibold mt-10">

                  Suggested Improvements

                </h2>

                <div className="mt-4 space-y-3">

                  {analysis?.improvements?.length > 0 ? (

                    analysis.improvements.map((item, index) => (

                      <div
                        key={index}
                        className="bg-blue-900/20 border border-blue-700 rounded-lg p-4"
                      >

                        <div className="flex items-start gap-3">

                          <span className="text-blue-400 text-lg">

                            🚀

                          </span>

                          <p className="text-slate-200">

                            {item}

                          </p>

                        </div>

                      </div>

                    ))

                  ) : (

                    <p className="text-slate-400">

                      No improvements available.

                    </p>

                  )}

                </div>

                <hr className="my-10 border-slate-700" />
                                {/* ================= Skill Gap Analysis ================= */}

                <h2 className="text-2xl font-semibold">
                  Skill Gap Analysis
                </h2>

                <div className="mt-5 bg-slate-900 border border-slate-700 rounded-xl p-6">

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    <div>

                      <p className="text-slate-400">
                        Current Developer Level
                      </p>

                      <h3 className="text-2xl font-bold text-cyan-400 mt-1">
                        {analysis?.skillGap?.overallLevel || "--"}
                      </h3>

                    </div>

                  </div>

                  <p className="mt-5 text-slate-300 leading-7">

                    {analysis?.skillGap?.summary ||
                      "No skill gap analysis available."}

                  </p>

                </div>

                {/* ================= Learning Roadmap ================= */}

                <h2 className="text-2xl font-semibold mt-10">
                  Recommended Learning Roadmap
                </h2>

                <div className="space-y-5 mt-6">

                  {analysis?.skillGap?.roadmap?.length > 0 ? (

                    analysis.skillGap.roadmap.map((item) => (

                      <div
                        key={item.order}
                        className="bg-slate-900 border border-slate-700 rounded-xl p-6"
                      >

                        <div className="flex flex-col md:flex-row md:justify-between gap-4">

                          <div>

                            <h3 className="text-xl font-bold">

                              {item.order}. {item.skill}

                            </h3>

                            <p className="text-slate-300 mt-3 leading-7">

                              {item.reason}

                            </p>

                          </div>

                          <div className="flex flex-wrap gap-2 h-fit">

                            <span className="bg-red-600 px-3 py-1 rounded-full text-sm">

                              {item.priority}

                            </span>

                            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">

                              {item.difficulty}

                            </span>

                            <span className="bg-green-600 px-3 py-1 rounded-full text-sm">

                              {item.estimatedLearningTime}

                            </span>

                          </div>

                        </div>

                      </div>

                    ))

                  ) : (

                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-slate-400">

                      No roadmap generated.

                    </div>

                  )}

                </div>

                {/* ================= Interview Questions ================= */}

                {/* <h2 className="text-2xl font-semibold mt-10">
                  Interview Questions
                </h2>

                <div className="space-y-5 mt-6">

                  {analysis?.interviewQuestions?.length > 0 ? (

                    analysis.interviewQuestions.map((item, index) => (

                      <div
                        key={index}
                        className="bg-slate-900 border border-slate-700 rounded-xl p-6"
                      >

                        <div className="flex flex-col md:flex-row md:justify-between gap-4">

                          <h3 className="font-semibold text-lg">

                            Q{index + 1}. {item.question}

                          </h3>

                          <span
                            className={`px-3 py-1 rounded-full text-sm h-fit ${
                              item.difficulty === "Easy"
                                ? "bg-green-600"
                                : item.difficulty === "Medium"
                                ? "bg-yellow-600"
                                : "bg-red-600"
                            }`}
                          >

                            {item.difficulty}

                          </span>

                        </div>

                      </div>

                    ))

                  ) : (

                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-slate-400">

                      No interview questions available.

                    </div>

                  )}

                </div> */}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );
};

export default Dashboard;