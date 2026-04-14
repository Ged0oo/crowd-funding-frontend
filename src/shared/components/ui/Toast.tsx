export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

const typeStyles = {
  success: "bg-primary text-on-primary",
  error:   "bg-error text-on-error",
  info:    "bg-inverse-surface text-inverse-on-surface",
};

export default function Toast({ message, type = "info" }: ToastProps) {
  return (
    <div className={`rounded-xl px-4 py-3 text-sm font-medium shadow-float ${typeStyles[type]}`}>
      {message}
    </div>
  );
}
