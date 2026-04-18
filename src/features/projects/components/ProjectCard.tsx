import React from "react";
import { Link } from "react-router-dom";
import type { ProjectCardProps } from "../../../types/projects";
import Badge from "../../../shared/components/ui/Badge";

export { type ProjectCardProps } from "../../../types/projects";

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  image,
  category,
  avg_rating,
  funded_pct,
}) => {
  const progressColor =
    funded_pct >= 100
      ? "bg-green-500"
      : funded_pct >= 75
        ? "bg-blue-500"
        : funded_pct >= 50
          ? "bg-blue-400"
          : funded_pct >= 25
            ? "bg-amber-500"
            : "bg-amber-400";

  const fullStars = Math.floor(avg_rating);
  const hasHalfStar = avg_rating - fullStars >= 0.5;

  return (
    <Link
      to={`/projects/${id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder-project.jpg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-project.jpg";
          }}
        />

        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <Badge variant="neutral">{category}</Badge>
        </div>

        {/* Funded badge */}
        <div className="absolute right-3 top-3">
          <Badge
            variant={
              funded_pct >= 100
                ? "success"
                : funded_pct >= 50
                  ? "primary"
                  : "neutral"
            }
          >
            {funded_pct >= 100
              ? "✅ Fully Funded"
              : `${funded_pct.toFixed(0)}% funded`}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3
          className="mb-3 text-base font-semibold text-gray-900 
                      line-clamp-2 leading-snug 
                      group-hover:text-blue-600 transition-colors"
        >
          {title}
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            let color = "text-gray-300";
            if (star <= fullStars) {
              color = "text-yellow-400";
            } else if (star === fullStars + 1 && hasHalfStar) {
              color = "text-yellow-300";
            }

            return (
              <svg
                key={star}
                className={`h-4 w-4 ${color}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            );
          })}
          <span className="ml-1 text-sm text-gray-500">
            {avg_rating > 0 ? avg_rating.toFixed(1) : "No ratings"}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
              style={{ width: `${Math.min(funded_pct, 100)}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-400">
            {funded_pct.toFixed(0)}%
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
