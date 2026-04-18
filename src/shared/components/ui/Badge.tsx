import type { HTMLAttributes, PropsWithChildren } from "react";

export interface BadgeProps
  extends PropsWithChildren, Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  variant?:
    | "primary"
    | "success"
    | "error"
    | "neutral"
    | "secondary"
    | "danger";
}

const variantStyles = {
  primary: "bg-primary-container/20 text-on-primary-container",
  success: "bg-primary-container/20 text-on-primary-container",
  error: "bg-error-container text-on-error-container",
  neutral: "bg-surface-container-high text-on-surface-variant",
  secondary: "bg-surface-container-high text-on-surface-variant",
  danger: "bg-error-container text-on-error-container",
};

export default function Badge({
  variant = "primary",
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
