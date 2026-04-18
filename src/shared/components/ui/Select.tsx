import type { SelectHTMLAttributes } from "react";

export interface SelectProps<
  T extends string = string,
> extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ label: string; value: T }>;
}

export default function Select<T extends string = string>({
  options,
  className = "",
  ...props
}: SelectProps<T>) {
  return (
    <select
      className={`w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
