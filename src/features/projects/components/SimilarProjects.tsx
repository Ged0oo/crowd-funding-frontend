import React from "react";
import { useSimilarProjects } from "../hooks/useProject";
import ProjectCard from "./ProjectCard";

import type { SimilarProjectsProps } from "../../../types/projects";

const SkeletonCard: React.FC = () => (
  <div className="animate-pulse rounded-xl border border-gray-200 bg-white">
    <div className="h-48 rounded-t-xl bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 rounded bg-gray-200" />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-4 rounded bg-gray-200" />
        ))}
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200" />
    </div>
  </div>
);

const SimilarProjects: React.FC<SimilarProjectsProps> = ({ projectId }) => {
  const { data, isLoading, isError } = useSimilarProjects(projectId);

  if (isError) return null;
  if (!isLoading && (!data?.results || data.results.length === 0)) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Similar Projects</h2>
        {data?.results && data.results.length > 0 && (
          <span className="text-sm text-gray-500">
            {data.results.length} project{data.results.length !== 1 && "s"}{" "}
            found
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          : data?.results.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                image={project.images[0]?.image ?? "/placeholder-project.jpg"}
                funded_pct={project.funded_pct}
                avg_rating={project.avg_rating}
                category={project.category?.name ?? "Uncategorized"}
              />
            ))}
      </div>
    </section>
  );
};

export default SimilarProjects;
export type { SimilarProjectsProps };
