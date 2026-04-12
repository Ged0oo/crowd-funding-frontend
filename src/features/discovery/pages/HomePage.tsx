export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-amber-900/15 bg-white p-6 shadow-sm">
        <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
          Discovery
        </p>
        <h1 className="mt-3 text-3xl font-bold text-stone-900">
          CrowdFund Egypt
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Launch meaningful projects and support creators across Egypt.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-stone-900">Top Rated</h2>
          <p className="mt-1 text-sm text-stone-600">
            Hero projects with best community ratings.
          </p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-stone-900">
            Latest Campaigns
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Fresh projects that were recently launched.
          </p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-stone-900">
            Featured Picks
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Editor-selected campaigns highlighted by admins.
          </p>
        </article>
      </div>
    </section>
  );
}
