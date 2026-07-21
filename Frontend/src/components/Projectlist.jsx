import React from "react";
import ProjectRow from "./ProjectRow";

const Projectlist = ({projectinfo,onSelectProject,deleteproject }) => {
  return (
    <div className="space-y-5">

      {projectinfo.map((project) => (

        <ProjectRow
          key={project._id}
          project={project}
          onSelectProject={onSelectProject}
          onDelete={deleteproject}
        />

      ))}

    </div>
  );
};

export default Projectlist;