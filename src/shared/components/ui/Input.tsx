import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-700 ${className}`}
      {...props}
    />
  );
}
