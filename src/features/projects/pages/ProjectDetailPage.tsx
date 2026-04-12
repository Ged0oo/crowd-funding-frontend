import { useParams } from "react-router-dom";

export default function ProjectDetailPage() {
  const { id } = useParams();

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold text-stone-900">Project #{id}</h1>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-stone-900">
            Project Overview
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Images, description, and creator information.
          </p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-stone-900">Donate</h2>
          <p className="mt-2 text-sm text-stone-600">
            Donation widget and progress components mount here.
          </p>
        </article>
      </div>

      <article className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-stone-900">Community</h2>
        <p className="mt-2 text-sm text-stone-600">
          Ratings, comments, replies, and report actions appear in this area.
        </p>
      </article>
    </section>
  );
}
