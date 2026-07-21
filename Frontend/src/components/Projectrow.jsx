import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProjectRow = ({ project,onDelete }) => {

  const [open, setOpen] = useState(false);

  return (

    <div className="bg-[#081222] border border-slate-700 rounded-xl p-5 hover:border-blue-500 transition">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-xl font-semibold text-white">
            {project.name}
          </h2>

          <div className="flex gap-4 mt-2 text-sm text-slate-400">

            <span>⭐ {project.stars}</span>

            <span>🍴 {project.forks}</span>

            <span>{project.language}</span>

          </div>

        </div>

        <button
          onClick={() => setOpen(!open)}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          {open ? "Hide Details" : "View Analysis"}
        </button>

      </div>

      {/* Expanded Section */}

      {open && (

        <div className="mt-6 border-t border-slate-700 pt-5 space-y-4">

          <div>

            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              GitHub Details
            </h3>

            <div className="space-y-2">

              <p>
                <span className="font-semibold">Description:</span>{" "}
                {project.description || "No Description"}
              </p>

              <p>
                <span className="font-semibold">Language:</span>{" "}
                {project.language}
              </p>

              <p>
                <span className="font-semibold">Stars:</span>{" "}
                ⭐ {project.stars}
              </p>

              <p>
                <span className="font-semibold">Forks:</span>{" "}
                🍴 {project.forks}
              </p>

              <p>
                <span className="font-semibold">Repository:</span>{" "}
                <a
                  href={project.projecturl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 underline"
                >
                  Open GitHub Repository
                </a>
              </p>

            </div>

          </div>

          <div className="pt-3 border-t border-slate-700">

            <Link
              to="/dashboard"
              state={{ projectId: project._id }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition"
            >
              🤖 Go To AI Dashboard →
            </Link>

            <button
              onClick={() => onDelete(project._id)}
              className="inline-flex items-center gap-2 px-6 py-3 ml-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
             >
             🗑 Delete Project
            </button>

          </div>

        </div>

      )}

    </div>

  );
};

export default ProjectRow;