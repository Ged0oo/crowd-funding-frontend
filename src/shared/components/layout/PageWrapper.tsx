import type { PropsWithChildren } from "react";

export default function PageWrapper({ children }: PropsWithChildren) {
  return (
    <main className="mx-auto w-full flex-1 px-6 pt-24 pb-16">
      {children}
    </main>
  );
}
