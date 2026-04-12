export interface ToastProps {
  message: string
}

export default function Toast({ message }: ToastProps) {
  return <div className="rounded-md bg-stone-900 px-3 py-2 text-sm text-white">{message}</div>
}
