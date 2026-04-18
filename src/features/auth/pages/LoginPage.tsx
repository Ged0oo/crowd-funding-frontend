import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-stone-900">Login</h1>
      <p className="text-sm text-stone-600">
        Sign in to donate, comment, and create campaigns.
      </p>
      <form className="space-y-3">
        <Input type="email" placeholder="Email address" />
        <Input type="password" placeholder="Password" />
        <Button type="button" className="w-full">
          Sign In
        </Button>
      </form>
    </section>
  );
}
