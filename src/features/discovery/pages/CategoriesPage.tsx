import React from "react";
import { Link } from "react-router-dom";

import { useCategories } from "../../projects/hooks/useCategories";
import Spinner from "../../../shared/components/ui/Spinner";

const CategoriesPage: React.FC = () => {
  const { data: categories, isLoading, isError, error } = useCategories();

  if (isLoading) {
    return (
      <section className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h1 className="text-2xl font-bold">Could not load categories</h1>
        <p className="mt-2 text-sm">
          {error?.message ?? "Please try again later."}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-900">All Categories</h1>
        <p className="mt-1 text-sm text-stone-600">
          Browse all project categories available on the platform.
        </p>
      </header>

      {!categories || categories.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
          No categories found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-stone-900">
                {category.name}
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                Open projects in this category.
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoriesPage;
