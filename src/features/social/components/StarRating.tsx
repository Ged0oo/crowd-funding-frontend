import { useState } from "react"
import { Star } from "lucide-react"
import { useRating } from "../hooks/useRating"
import { toast } from "sonner"

interface StarRatingProps {
  projectId: number
  initialRating?: number
}

export default function StarRating({ projectId, initialRating = 0 }: StarRatingProps) {
  const [hover, setHover] = useState(0)
  
  const { mutateAsync: rate, isPending } = useRating(projectId)

  const handleRate = async (value: number) => {
    try {
      await rate(value)
      toast.success(`You rated this ${value} stars!`)
    } catch{
      toast.error("Failed to save rating")
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isPending}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => handleRate(star)}
            className="relative transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Star
              size={24}
              className={`transition-colors duration-200 ${
                star <= (hover || initialRating)
                  ? "fill-primary text-primary"
                  : "text-outline-variant fill-transparent"
              } ${!isPending && "group-hover:scale-110"}`}
            />
          </button>
        ))}
        
        {initialRating > 0 && (
          <span className="ml-2 font-bold text-on-surface font-headline">
            {initialRating.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  )
}