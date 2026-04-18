import React from "react";
import { useSearchParams } from "react-router-dom";

import { useProjects } from "../hooks/useProject";
import ProjectCard from "../components/ProjectCard";
import Spinner from "../../../shared/components/ui/Spinner";
import PageWrapper from "../../../shared/components/layout/PageWrapper";

const PAGE_SIZE = 12;

const ProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawPage = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const { data, isLoading, isError, error } = useProjects({
    page,
    page_size: PAGE_SIZE,
  });
  const projects = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const hasPrevious = Boolean(data?.previous) && page > 1;
  const hasNext = Boolean(data?.next);

  const goToPage = (nextPage: number) => {
    const safePage = Math.max(1, nextPage);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (safePage === 1) {
        next.delete("page");
      } else {
        next.set("page", String(safePage));
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <p className="mt-2 text-xs font-medium text-stone-500">
            {totalCount.toLocaleString()} projects · Page {page} · {PAGE_SIZE}{" "}
            per page
          </p>
        </header>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
            No projects found.
          </div>
        ) : (
          <>
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

            <nav
              aria-label="Projects pagination"
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4"
            >
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={!hasPrevious}
                className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <p className="text-sm text-stone-600">
                Page{" "}
                <span className="font-semibold text-stone-900">{page}</span>
              </p>

              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={!hasNext}
                className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          </>
        )}
      </section>
    </PageWrapper>
  );
};

export default ProjectsPage;
