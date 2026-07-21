import  { useState } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { Code2, Menu, X } from "lucide-react";

function Navbar() {
    const navigate=useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path:"/#features" },
    { name: "Projects", path: "/Projects" },
    { name: "Resume Review", path: "/resume-review" },
    { name: "Interview Questions", path: "/interview-questions" },
    // { name: "Skill Learn", path: "/skill-learn" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <header className="bg-[#050B1F] border-b border-slate-800">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center">
              <Code2 className="text-white" size={22} />
            </div>

            <div>
              <h1 className="text-white font-bold text-xl">
                AI GitHub
              </h1>

              <p className="text-blue-400 text-xs">
                Project Analyzer
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition ${
                    isActive
                      ? "text-blue-500"
                      : "text-slate-300 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}

                    {isActive && (
                      <span className="absolute -bottom-7 left-0 w-full h-[2px] bg-blue-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-4">
           <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 border border-blue-600/30 rounded-xl text-white
                hover:bg-blue-600/10 hover:scale-105 active:scale-95
                transition-all duration-200">
                    Login
             </button>

             <button
                 onClick={() => navigate("/register")}
                 className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600
                 text-white shadow-lg shadow-blue-500/20
                 hover:scale-105 active:scale-95
                 transition-all duration-200">
                  Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="lg:hidden pb-5">
            <div className="flex flex-col gap-2 bg-[#09142D] p-4 rounded-2xl">
              
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenu(false)}
                  className="text-slate-300 hover:text-white py-2"
                >
                  {link.name}
                </NavLink>
              ))}

              <button
                  onClick={() => navigate("/login")}
                  className="mt-4 py-3 border border-blue-600/30 rounded-xl text-white
                  hover:bg-blue-600/10 hover:scale-105 active:scale-95
                  transition-all duration-200">
                      Login
              </button>

              <button
                  onClick={() => navigate("/register")}
                  className="py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white
                  hover:scale-105 active:scale-95
                  transition-all duration-200">
                      Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
  


export default Navbar;