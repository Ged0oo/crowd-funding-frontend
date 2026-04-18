import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useRating } from "../hooks/useRating";
import { useAuthStore } from "../../auth/stores/authStore";
import { toast } from "sonner";

interface StarRatingProps {
  projectId: number;
  isOwner: boolean;
  averageRating: number;
  userRating: number | null;
}

export default function StarRating({
  projectId,
  isOwner,
  averageRating,
  userRating,
}: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const { mutateAsync: rate, isPending } = useRating(projectId);

  const handleRate = async (value: number) => {
    if (!user) {
      toast.info("Please login to rate this project");
      navigate("/authenticate");
      return;
    }

    if (isOwner) {
      return;
    }

    try {
      await rate(value);
      toast.success(`You rated this ${value} stars!`);
    } catch {
      toast.error("Failed to save rating");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isPending || isOwner}
            onMouseEnter={() => !isOwner && setHover(star)}
            onMouseLeave={() => !isOwner && setHover(0)}
            onClick={() => handleRate(star)}
            className="relative transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Star
              size={24}
              className={`transition-colors duration-200 ${
                star <= (hover || (userRating ?? 0))
                  ? "fill-primary text-primary"
                  : "text-outline-variant fill-transparent"
              } ${!isPending && !isOwner && "group-hover:scale-110"}`}
            />
          </button>
        ))}

        <div className="flex items-center gap-1 ml-2">
          <span className="font-bold text-on-surface font-headline">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-outline">Average</span>
        </div>
      </div>
      
      {userRating !== null && !isOwner && (
        <p className="text-xs text-primary font-medium">You rated this {userRating} stars</p>
      )}
    </div>
  );
}
