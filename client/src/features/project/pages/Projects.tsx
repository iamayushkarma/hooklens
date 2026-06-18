import { useEffect, useState } from "react";
import { getProjects } from "../api/getProject";
import { useWorkspaceStore } from "@/store/workspace.store";
import { ProjectCard } from "../components/ProjectCard";
import CreateProjectCard from "../components/CreateProjectCard";
import type { Project } from "../types/project.types";

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const workspaceId = useWorkspaceStore((store) => store.currentWorkspaceId);
  useEffect(() => {
    if (!workspaceId) return;

    const fetchProject = async () => {
      const res = await getProjects(workspaceId);
      setProjects(res);
      console.log(res);
    };
    fetchProject();
  }, [workspaceId]);
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}

        <CreateProjectCard />
      </div>
    </div>
  );
}

export default Projects;
