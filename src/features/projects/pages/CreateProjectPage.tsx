export default function CreateProjectPage() {
  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold text-stone-900">Create Project</h1>
      <p className="text-sm text-stone-600">
        Simple three-step layout for the project creation flow.
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="font-semibold text-stone-900">Step 1</h2>
          <p className="mt-1 text-sm text-stone-600">
            Project details, category, target, and dates.
          </p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="font-semibold text-stone-900">Step 2</h2>
          <p className="mt-1 text-sm text-stone-600">
            Image upload with limits and preview.
          </p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="font-semibold text-stone-900">Step 3</h2>
          <p className="mt-1 text-sm text-stone-600">
            Tags, review, and final submission.
          </p>
        </article>
      </div>
    </section>
  );
}
