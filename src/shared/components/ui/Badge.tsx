import type { PropsWithChildren } from "react";

export interface BadgeProps extends PropsWithChildren {
  variant?: "primary" | "success" | "error" | "neutral";
}

const variantStyles = {
  primary: "bg-primary-container/20 text-on-primary-container",
  success: "bg-primary-container/20 text-on-primary-container",
  error:   "bg-error-container text-on-error-container",
  neutral: "bg-surface-container-high text-on-surface-variant",
};

export default function Badge({ variant = "primary", children }: BadgeProps) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
