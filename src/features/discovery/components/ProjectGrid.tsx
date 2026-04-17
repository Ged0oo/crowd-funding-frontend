import type { ProjectCardProps } from "../../../types/projects";
import ProjectCard from "../../projects/components/ProjectCard";

interface ProjectGridProps {
  projects: ProjectCardProps[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <p className="text-on-surface-variant text-sm">No projects to show.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}
