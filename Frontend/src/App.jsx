import Navbar from './components/Navbar';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeReview from './pages/ResumeReview';
import SkillLearn from './pages/SkillLearn';
import IntQuestion from './pages/IntQuestion';
import Authprotect from './RouteProtection/Authprotect';


function App() {
  

  return (
    <div>
    
          <Navbar />
    
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/Home" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/Projects"  element={

              <Authprotect>
                <Projects/> 
              </Authprotect>

              }/>
            <Route path="/Dashboard" element={

              <Authprotect>
                <Dashboard/>
              </Authprotect> 

              }/>

            <Route path="/resume-review" element={
                
                <Authprotect>
                  <ResumeReview/>
                  </Authprotect>
              }/>

            <Route path="/skill-learn" element={<SkillLearn/>}/>

            <Route path="/interview-questions" element={
              
              <Authprotect>
                <IntQuestion/>
                </Authprotect>
              }/>
            
          </Routes>
    
        </div>
  )
}

export default App
