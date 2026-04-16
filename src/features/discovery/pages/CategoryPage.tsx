import { useParams } from "react-router-dom";
import { useCategory } from "../hooks/useCategory";
import ProjectGrid from "../components/ProjectGrid";
import Spinner from "../../../shared/components/ui/Spinner";

export default function CategoryPage() {
  const { slug = "" } = useParams();
  const { data, isLoading, isError } = useCategory(slug);

  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-black font-headline text-on-surface">{title}</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Browse all projects in this category.
        </p>
      </header>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <p className="text-error">Could not load projects. Please try again.</p>
      )}

      {data && data.length === 0 && (
        <p className="text-on-surface-variant">No projects in this category yet.</p>
      )}

      {data && data.length > 0 && <ProjectGrid projects={data} />}
    </section>
  );
}
