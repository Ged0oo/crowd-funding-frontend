import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-stone-900">Create account</h1>
      <p className="text-sm text-stone-600">
        Join CrowdFund Egypt and start supporting projects.
      </p>
      <RegisterForm/>
    </section>
  );
}
