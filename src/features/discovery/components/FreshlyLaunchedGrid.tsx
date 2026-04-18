import { Link } from "react-router-dom";
import type { ProjectCardProps } from "../../../types/projects";
import ProjectCard from "../../projects/components/ProjectCard";

interface FreshlyLaunchedGridProps {
  projects: ProjectCardProps[];
}

function ProjectImage({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  if (src) {
    return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />;
  }
  return <div className={`w-full h-full bg-linear-to-br from-surface-container to-surface-container-high ${className}`} />;
}

function TallCard({ project }: { project: ProjectCardProps }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group relative block rounded-[2rem] overflow-hidden border border-outline-variant/10 h-full"
    >
      <div className="absolute inset-0">
        <ProjectImage src={project.image} alt={project.title} className="group-hover:scale-105 transition-transform duration-700" />
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent p-8 flex flex-col justify-end">
        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase w-fit">
          {project.category}
        </span>
        <h3 className="text-2xl font-bold font-headline text-white mb-4">{project.title}</h3>

        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-primary-container rounded-full" style={{ width: `${Math.min(project.funded_pct, 100)}%` }} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white font-black text-xl">{project.funded_pct}% Funded</span>
          <span className="text-white/60 text-xs font-bold uppercase">★ {project.avg_rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function FreshlyLaunchedGrid({ projects }: FreshlyLaunchedGridProps) {
  if (projects.length === 0) {
    return <p className="text-on-surface-variant text-sm">No projects to show.</p>;
  }

  const [tall, ...cards] = projects;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-fr">
      <div className="md:row-span-2 min-h-[500px]">
        {tall && <TallCard project={tall} />}
      </div>

      {cards.slice(0, 4).map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}
