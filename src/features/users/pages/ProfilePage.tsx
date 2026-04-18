export default function ProfilePage() {
  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold text-stone-900">My Profile</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border border-stone-200 bg-white p-4 lg:col-span-1">
          <h2 className="font-semibold text-stone-900">Profile Info</h2>
          <p className="mt-1 text-sm text-stone-600">
            Basic account and identity details.
          </p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4 lg:col-span-2">
          <h2 className="font-semibold text-stone-900">My Projects</h2>
          <p className="mt-1 text-sm text-stone-600">
            Campaigns created by this account.
          </p>
        </article>
      </div>

      <article className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="font-semibold text-stone-900">Donation History</h2>
        <p className="mt-1 text-sm text-stone-600">
          Recent donations and totals will be listed here.
        </p>
      </article>
    </section>
  );
}
