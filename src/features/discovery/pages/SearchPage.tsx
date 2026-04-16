import { useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import ProjectGrid from "../components/ProjectGrid";
import Spinner from "../../../shared/components/ui/Spinner";

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
        <p className="text-on-surface-variant">Enter a search term to find projects.</p>
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <p className="text-error">Something went wrong. Please try again.</p>
      )}

      {data && data.results.length === 0 && (
        <p className="text-on-surface-variant">No projects match your search.</p>
      )}

      {data && data.results.length > 0 && (
        <ProjectGrid projects={data.results} />
      )}
    </section>
  );
}
