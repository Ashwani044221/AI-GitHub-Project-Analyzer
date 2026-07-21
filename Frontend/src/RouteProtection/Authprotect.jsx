import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../API/axois";

function Authprotect({ children }) {

  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {

    const checkAuth = async () => {

      try {

        const res = await API.get("/api/analyzer/me");

        setIsAuth(true);

        // Keep localStorage updated for UI purposes
        localStorage.setItem("user", JSON.stringify(res.data.user));

      } catch (err) {

        setIsAuth(false);

        localStorage.removeItem("user");
        localStorage.removeItem("selectedProjectId");

      } finally {

        setLoading(false);

      }

    };

    checkAuth();

  }, []);

  if (loading) {

    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
        Checking Authentication...
      </div>
    );

  }

  if (!isAuth) {

    return <Navigate to="/login" replace />;

  }

  return children;
}

export default Authprotect;