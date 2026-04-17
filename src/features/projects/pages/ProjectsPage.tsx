import React from "react";

import { useProjects } from "../hooks/useProject";
import ProjectCard from "../components/ProjectCard";
import Spinner from "../../../shared/components/ui/Spinner";
import PageWrapper from "../../../shared/components/layout/PageWrapper";

const ProjectsPage: React.FC = () => {
  const { data, isLoading, isError, error } = useProjects();
  const projects = data?.results ?? [];

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner />
        </div>
      </PageWrapper>
    );
  }

  if (isError) {
    return (
      <PageWrapper>
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h1 className="text-2xl font-bold">Could not load projects</h1>
          <p className="mt-2 text-sm">
            {error?.message ?? "Please try again later."}
          </p>
        </section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section className="space-y-6">
        <header className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-stone-900">All Projects</h1>
          <p className="mt-1 text-sm text-stone-600">
            Browse active campaigns from creators across the platform.
          </p>
        </header>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
            No projects found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const image =
                project.images[0]?.image ?? "/placeholder-project.jpg";

              return (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  image={image}
                  funded_pct={project.funded_pct}
                  avg_rating={project.avg_rating}
                  category={project.category?.name ?? "Uncategorized"}
                />
              );
            })}
          </div>
        )}
      </section>
    </PageWrapper>
  );
};

export default ProjectsPage;
