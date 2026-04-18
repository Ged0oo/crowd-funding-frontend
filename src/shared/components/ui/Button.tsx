import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

const variantStyles = {
  primary:
    "bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-md hover:shadow-lg",
  secondary:
    "bg-surface-container-high text-on-secondary-container hover:bg-surface-container",
  ghost: "text-primary hover:bg-surface-container-low",
  danger: "bg-error-container text-on-error-container hover:brightness-95",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  return (
    <button
      className={`${base} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
