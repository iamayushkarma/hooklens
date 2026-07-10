import { useEffect, useState } from "react";
import { useWorkspaceStore } from "@/store/workspace.store";
import { getProjects } from "../api/getProject";
import CreateProjectCard from "../components/CreateProjectBtn";
import { ProjectCard } from "../components/ProjectCard";
import type { Project } from "../types/project.types";
import { ProjectsPageSkeleton } from "@/shared/components/skletons/ProjectsPageSkeleton";

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const workspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
  const setProjectsStore = useWorkspaceStore((state) => state.setProjects);

  const fetchProjects = async () => {
    if (!workspaceId) return;
    try {
      const res = await getProjects(workspaceId);
      setProjects(res.projects);
      setProjectsStore(res.projects);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [workspaceId]);

  if (loading) {
    return <ProjectsPageSkeleton />;
  }

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
