import React from "react";

import { useProjects } from "../hooks/useProject";
import ProjectCard from "../components/ProjectCard";
import Spinner from "../../../shared/components/ui/Spinner";
import PageWrapper from "../../../shared/components/layout/PageWrapper";

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

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
              const rawProject = project as unknown as {
                id: number;
                title: string;
                images?: Array<{ image?: string | null }>;
                cover_image?: string | null;
                funded_pct?: number | string;
                avg_rating?: number | string;
                average_rating?: number | string;
                total_target?: number | string;
                current_amount?: number | string;
                current_donations?: number | string;
                category?: { name?: string } | null;
              };

              const totalTarget = toNumber(rawProject.total_target);
              const currentAmount =
                toNumber(rawProject.current_donations) ||
                toNumber(rawProject.current_amount);

              const fundedPct =
                rawProject.funded_pct !== undefined
                  ? toNumber(rawProject.funded_pct)
                  : totalTarget > 0
                    ? (currentAmount / totalTarget) * 100
                    : 0;

              const avgRating =
                rawProject.avg_rating !== undefined
                  ? toNumber(rawProject.avg_rating)
                  : toNumber(rawProject.average_rating);

              const image =
                rawProject.images?.[0]?.image ||
                rawProject.cover_image ||
                "/placeholder-project.jpg";

              return (
                <ProjectCard
                  key={rawProject.id}
                  id={rawProject.id}
                  title={rawProject.title}
                  image={image}
                  funded_pct={fundedPct}
                  avg_rating={avgRating}
                  category={rawProject.category?.name ?? "Uncategorized"}
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
