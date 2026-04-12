import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base = "rounded-md px-4 py-2 text-sm font-semibold transition";
  const look =
    variant === "primary"
      ? "bg-amber-900 text-white hover:bg-amber-800"
      : "bg-amber-100 text-amber-900 hover:bg-amber-200";

  return <button className={`${base} ${look} ${className}`} {...props} />;
}
