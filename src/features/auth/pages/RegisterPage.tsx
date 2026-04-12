import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";

export default function RegisterPage() {
  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-stone-900">Create account</h1>
      <p className="text-sm text-stone-600">
        Join CrowdFund Egypt and start supporting projects.
      </p>
      <form className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="First name" />
        <Input placeholder="Last name" />
        <Input type="email" placeholder="Email" className="sm:col-span-2" />
        <Input placeholder="Phone" className="sm:col-span-2" />
        <Input
          type="password"
          placeholder="Password"
          className="sm:col-span-2"
        />
        <Input
          type="password"
          placeholder="Confirm password"
          className="sm:col-span-2"
        />
        <Button type="button" className="sm:col-span-2">
          Create Account
        </Button>
      </form>
    </section>
  );
}
