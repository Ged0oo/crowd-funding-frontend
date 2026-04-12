import type { TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-700 ${className}`}
      {...props}
    />
  );
}
