export interface AvatarProps {
  src?: string | null
  alt?: string
}

export default function Avatar({ src, alt = 'Avatar' }: AvatarProps) {
  if (src) {
    return <img src={src} alt={alt} className="h-9 w-9 rounded-full object-cover" />
  }

  return <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-xs text-stone-600">N/A</div>
}
