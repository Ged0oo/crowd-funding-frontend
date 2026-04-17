import { useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import ProjectGrid from "../components/ProjectGrid";

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

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const { data, isLoading, isError } = useSearch(q);

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-black font-headline text-on-surface">
          {q ? `Results for "${q}"` : "Search Projects"}
        </h1>
        {data && (
          <p className="mt-1 text-sm text-on-surface-variant">
            {data.count} project{data.count !== 1 ? "s" : ""} found
          </p>
        )}
      </header>

      {!q && (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="material-symbols-outlined text-6xl text-outline/40 mb-4">
            search
          </span>
          <p className="text-on-surface-variant text-lg">
            Enter a search term to find projects.
          </p>
          <p className="text-on-surface-variant/60 text-sm mt-1">
            Try searching by project title or tag name
          </p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-error">Something went wrong. Please try again.</p>
      )}

      {data && data.results.length === 0 && q && (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="material-symbols-outlined text-6xl text-outline/40 mb-4">
            search_off
          </span>
          <p className="text-on-surface-variant text-lg">
            No projects match "{q}"
          </p>
          <p className="text-on-surface-variant/60 text-sm mt-1">
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {data && data.results.length > 0 && (
        <ProjectGrid projects={data.results} />
      )}
    </section>
  );
}
