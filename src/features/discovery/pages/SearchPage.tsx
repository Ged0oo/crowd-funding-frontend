import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-900">Search Results</h1>
        <p className="mt-1 text-sm text-stone-600">
          {q ? `Query: ${q}` : "No query provided"}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <article
            key={index}
            className="rounded-xl border border-stone-200 bg-white p-4"
          >
            <div className="h-24 rounded-lg bg-stone-100" />
            <h2 className="mt-3 text-base font-semibold text-stone-900">
              Result Placeholder
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Matching projects will be rendered from the API.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
