import { useEffect, useState } from "react";

import { useWorkspaceStore } from "@/store/workspace.store";

import { getProjects } from "../api/getProject";
import CreateProjectCard from "../components/CreateProjectBtn";
import { ProjectCard } from "../components/ProjectCard";

import type { Project } from "../types/project.types";

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const workspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);

  const setProjectsStore = useWorkspaceStore((state) => state.setProjects);

  const fetchProjects = async () => {
    if (!workspaceId) return;

    const res = await getProjects(workspaceId);

    setProjects(res.projects);
    setProjectsStore(res.projects);
  };

  useEffect(() => {
    fetchProjects();
  }, [workspaceId]);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onSuccess={fetchProjects}
          />
        ))}

        <CreateProjectCard onSuccess={fetchProjects} />
      </div>
    </div>
  );
}

export default Projects;
