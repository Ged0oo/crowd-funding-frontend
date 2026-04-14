import { useState } from "react";
import { Link } from "react-router-dom";
import type { ProjectCard } from "../../../types/projects";

interface HeroSliderProps {
  projects: ProjectCard[];
}

export default function HeroSlider({ projects }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  if (projects.length === 0) return null;

  const project = projects[current];

  return (
    <section className="px-8 mb-16">
      <div className="relative w-full aspect-21/9 rounded-[2.5rem] overflow-hidden shadow-2xl group">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-primary to-primary-container" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-on-background/80 via-on-background/20 to-transparent flex flex-col justify-end p-16">
          <div className="max-w-2xl">
            <span className="inline-block bg-primary-container text-on-primary-container text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
              Top 5 Rated
            </span>
            <h1 className="text-5xl md:text-6xl font-black font-headline text-white mb-6 leading-tight">
              {project.title}
            </h1>
            <p className="text-lg text-white/90 mb-8 font-body max-w-xl">
              {project.category} &bull; {project.funded_pct}% funded
            </p>
            <div className="flex gap-4">
              <Link
                to={`/projects/${project.id}`}
                className="bg-linear-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                Back this Project
              </Link>
              <Link
                to={`/projects/${project.id}`}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-16 flex gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-12 bg-white" : "w-3 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
