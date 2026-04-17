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
        <Link
          key={project.id}
          to={`/projects/${project.id}`}
          className="group bg-surface-container-lowest rounded-[2rem] overflow-hidden flex flex-col hover:shadow-[0_32px_64px_-12px_rgba(25,28,30,0.06)] transition-all duration-500 border border-outline-variant/10"
        >
          <div className="relative h-56 overflow-hidden">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-surface-container to-surface-container-high" />
            )}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-md text-primary font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                {project.category}
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col grow">
            <h3 className="text-xl font-bold font-headline mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-secondary mb-6 line-clamp-2">
              A community-driven project making a real difference in the region.
            </p>

            <div className="mt-auto">
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-black text-on-surface">
                  {project.funded_pct}%
                </span>
                <span className="text-xs font-bold text-secondary uppercase tracking-tighter">
                  {daysLeft(project)}
                </span>
              </div>

              <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-linear-to-r from-primary to-primary-fixed-dim rounded-full"
                  style={{ width: `${Math.min(project.funded_pct, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-xs font-bold">
                <span className="text-on-surface">
                  {formatEGP(Math.round(project.funded_pct * 1000))}
                </span>
                <span className="text-secondary">of {formatEGP(100000)}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
