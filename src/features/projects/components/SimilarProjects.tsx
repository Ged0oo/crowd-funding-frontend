import React from "react";
import { useSimilarProjects } from "../hooks/useProject";
import ProjectCard from "./ProjectCard";
import Spinner from "../../../shared/components/ui/Spinner";

import type { SimilarProjectsProps } from "../../../types/projects";

const SimilarProjects: React.FC<SimilarProjectsProps> = ({ projectId }) => {
  const { data, isLoading, isError } = useSimilarProjects(projectId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (isError || !data?.results?.length) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Similar Projects
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.results.map((project) => (
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
