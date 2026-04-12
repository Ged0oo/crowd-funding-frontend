import { useParams } from "react-router-dom";

export default function ActivatePage() {
  const { token } = useParams();

  return (
    <section className="mx-auto max-w-xl space-y-3 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-stone-900">Account Activation</h1>
      <p className="text-sm text-stone-600">Activation link status preview.</p>
      <div className="rounded-lg bg-stone-100 p-3 text-sm text-stone-700">
        Token: {token ?? "Missing token"}
      </div>
    </section>
  );
}
