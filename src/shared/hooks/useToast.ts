import { useState } from 'react'

export function useToast() {
  const [message, setMessage] = useState<string | null>(null)

  const showToast = (nextMessage: string) => {
    setMessage(nextMessage)
    window.setTimeout(() => setMessage(null), 2500)
  }

  return { message, showToast }
}
