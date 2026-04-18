import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  className = "",
  label,
  error,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  const inputElement = (
    <input
      id={inputId}
      className={`w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all ${className}`}
      {...props}
    />
  );

  if (!label && !error) {
    return inputElement;
  }

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      {inputElement}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
