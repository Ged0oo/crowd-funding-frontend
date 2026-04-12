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
      className={`w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-700 ${className}`}
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
