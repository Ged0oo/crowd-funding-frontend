import { useParams } from "react-router-dom";
import { useCategory } from "../hooks/useCategory";
import ProjectGrid from "../components/ProjectGrid";

function slugToTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function SkeletonCard() {
  return (
    <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden border border-outline-variant/10 animate-pulse">
      <div className="h-56 bg-surface-container-high" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-surface-container-high rounded-lg w-3/4" />
        <div className="h-4 bg-surface-container-high rounded-lg w-1/2" />
        <div className="h-2 bg-surface-container-high rounded-full mt-4" />
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const { slug = "" } = useParams();
  const { data, isLoading, isError } = useCategory(slug);

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-black font-headline text-on-surface">
          {slugToTitle(slug)}
        </h1>
        {data && (
          <p className="mt-1 text-sm text-on-surface-variant">
            {data.count} project{data.count !== 1 ? "s" : ""} in this category
          </p>
        )}
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-error">Could not load projects. Please try again.</p>
      )}

      {data && data.results.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="material-symbols-outlined text-6xl text-outline/40 mb-4">
            folder_open
          </span>
          <p className="text-on-surface-variant text-lg">
            No projects in this category yet.
          </p>
        </div>
      )}

      {data && data.results.length > 0 && (
        <>
          <ProjectGrid projects={data.results} />
          {data.next && (
            <div className="flex justify-center pt-4">
              <p className="text-sm text-on-surface-variant">
                Showing {data.results.length} of {data.count} projects
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
