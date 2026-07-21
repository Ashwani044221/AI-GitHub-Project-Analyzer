import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const Home = () => {
 const location = useLocation();

 const scrollToFeatures = () => {
  document
    .getElementById("features")
    ?.scrollIntoView({ behavior: "smooth" });
};

  useEffect(() => {
    if (location.hash === "#features") {
      document
        .getElementById("features")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);


  return (
    <div className="bg-[#040B1E] min-h-screen text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative py-16 lg:py-20">

        {/* Background Glow */}
        <div className="absolute inset-0">
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_left,#1d4ed840,transparent_40%)]" />
          <div className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(circle_at_right,#2563eb20,transparent_40%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">

          {/* Badge */}
          <div className="inline-flex items-center px-5 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20">
            <span className="text-blue-300 text-sm font-medium">
              AI Powered • Smart Analysis • Career Growth
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              AI GitHub
            </span>

            <br />

            <span className="bg-gradient-to-r from-purple-200 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
              Project Analyzer
            </span>
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-3xl text-slate-300 text-lg md:text-xl leading-relaxed">
            Transform your GitHub repositories into powerful career assets.
            Get AI-driven project analysis, resume reviews, interview
            preparation, skill-gap detection, and professional reports —
            all in one intelligent platform.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-wrap gap-5">

            <button
              className="group px-8 py-4 rounded-2xl
              bg-gradient-to-r from-blue-600 to-purple-600
              text-white font-semibold
              shadow-lg shadow-blue-600/30
              hover:scale-105 active:scale-95
              transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                Get Started
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </button>

            <button
              onClick={scrollToFeatures}
              className="px-8 py-4 rounded-2xl
              border border-blue-500/30
              bg-[#09142D]
              text-white font-semibold
              hover:border-blue-400
              hover:bg-[#0E1C3F]
              transition-all duration-300"
            >
              Explore Features
            </button>

          </div>

          {/* Feature Pills */}
          <div className="mt-14 flex flex-wrap gap-6 text-slate-400">

            <div className="flex items-center gap-2">
              <span className="text-blue-400">✓</span>
              GitHub Integration
            </div>

            <div className="flex items-center gap-2">
              <span className="text-blue-400">✓</span>
              AI Analysis
            </div>

            <div className="flex items-center gap-2">
              <span className="text-blue-400">✓</span>
              Resume Review
            </div>

            <div className="flex items-center gap-2">
              <span className="text-blue-400">✓</span>
              PDF Reports
            </div>

          </div>

        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-24"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-600/10 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Powerful Features to Boost Your Career
            </h2>

            <p className="mt-4 text-slate-400 text-lg">
              Everything you need to analyze, improve, and showcase your skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {[
              {
                icon: "🐙",
                title: "GitHub Analysis",
                desc: "Analyze repositories, coding practices, technologies and project structure.",
              },
              {
                icon: "🧠",
                title: "AI Project Review",
                desc: "Receive detailed AI-generated strengths, weaknesses and recommendations.",
              },
              {
                icon: "📄",
                title: "Resume Review",
                desc: "Optimize your resume with ATS-friendly feedback and suggestions.",
              },
              {
                icon: "❓",
                title: "Interview Questions",
                desc: "Generate personalized interview questions based on your projects.",
              },
              {
                icon: "📈",
                title: "Skill Gap Analysis",
                desc: "Identify missing skills and get a roadmap for improvement.",
              },
              {
                icon: "📑",
                title: "Professional Reports",
                desc: "Download beautiful reports and insights for your portfolio.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[#09142D]
                border border-blue-900/20
                rounded-3xl
                p-7
                hover:border-blue-500/40
                hover:-translate-y-2
                transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl mb-5">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>
     <Footer />
    </div>
  );
};

export default Home;

