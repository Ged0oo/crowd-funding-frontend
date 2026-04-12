import type { PropsWithChildren } from "react";

export interface ModalProps extends PropsWithChildren {
  open: boolean;
  title: string;
}

export default function Modal({ open, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-soft">
        <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
