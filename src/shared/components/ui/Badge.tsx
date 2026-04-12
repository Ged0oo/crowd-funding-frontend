import type { PropsWithChildren } from "react";

export type BadgeProps = PropsWithChildren;

export default function Badge({ children }: BadgeProps) {
  return (
    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
      {children}
    </span>
  );
}
