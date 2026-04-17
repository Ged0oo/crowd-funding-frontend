import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  className = "",
  label,
  error,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  const textareaElement = (
    <textarea
      id={textareaId}
      className={`w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none ${className}`}
      {...props}
    />
  );

  if (!label && !error) {
    return textareaElement;
  }

  return (
    <div>
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      {textareaElement}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
