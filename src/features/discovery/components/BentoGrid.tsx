import { Link } from "react-router-dom";
import type { ProjectCard } from "../../../types/projects";

interface BentoGridProps {
  projects: ProjectCard[];
}

function ProjectImage({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  if (src) {
    return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} />;
  }
  return <div className={`w-full h-full bg-linear-to-br from-surface-container to-surface-container-high ${className}`} />;
}

function TallCard({ project }: { project: ProjectCard }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="md:col-span-1 md:row-span-2 group relative rounded-[2rem] overflow-hidden min-h-[480px] border border-outline-variant/10"
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
          <span className="text-white/60 text-xs font-bold uppercase">Just In</span>
        </div>
      </div>
    </Link>
  );
}

function WideCard({ project }: { project: ProjectCard }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="md:col-span-2 group bg-white rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 items-center border border-outline-variant/10"
    >
      <div className="w-full md:w-1/2 h-48 rounded-2xl overflow-hidden">
        <ProjectImage src={project.image} alt={project.title} className="group-hover:scale-110 transition-transform duration-700" />
      </div>

      <div className="w-full md:w-1/2">
        <span className="bg-surface-container-high text-primary font-bold text-[10px] px-3 py-1 rounded-full uppercase mb-4 inline-block">
          {project.category}
        </span>
        <h3 className="text-2xl font-bold font-headline mb-2">{project.title}</h3>
        <p className="text-sm text-secondary mb-6">A community-driven project making a real difference.</p>

        <div className="flex items-center gap-4">
          <div className="grow h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(project.funded_pct, 100)}%` }} />
          </div>
          <span className="text-sm font-black text-on-surface">{project.funded_pct}%</span>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ project, badge }: { project: ProjectCard; badge: string }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group bg-white rounded-[2rem] p-6 border border-outline-variant/10"
    >
      <div className="h-40 rounded-xl overflow-hidden mb-6">
        <ProjectImage src={project.image} alt={project.title} className="group-hover:scale-110 transition-transform duration-700" />
      </div>
      <h4 className="text-lg font-bold font-headline mb-1">{project.title}</h4>
      <p className="text-xs text-secondary mb-4">A community-driven project making a real difference.</p>
      <div className="flex justify-between items-center">
        <span className="text-primary font-bold text-sm">{Math.round(project.funded_pct * 1000).toLocaleString()} EGP</span>
        <span className="bg-primary-fixed text-on-primary-fixed text-[10px] px-2 py-1 rounded-md font-bold">{badge}</span>
      </div>
    </Link>
  );
}

export default function BentoGrid({ projects }: BentoGridProps) {
  if (projects.length === 0) {
    return <p className="text-on-surface-variant text-sm">No projects to show.</p>;
  }

  const [tall, wide, ...rest] = projects;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {tall && <TallCard project={tall} />}
      {wide && <WideCard project={wide} />}
      {rest[0] && <SmallCard project={rest[0]} badge="NEW" />}
      {rest[1] && <SmallCard project={rest[1]} badge="HOT" />}
    </div>
  );
}
