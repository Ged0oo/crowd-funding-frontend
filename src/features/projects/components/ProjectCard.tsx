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
      : funded_pct >= 50
        ? "bg-blue-500"
        : "bg-amber-300";
  return (
    <Link
      to={`/projects/${id}`}
      className="group block rounded-xl border border-gray-200 bg-white shadow-sm 
                 transition-all hover:shadow-md hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform 
                     duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <Badge>{category}</Badge>
        </div>
        {/* Funded badge */}
        <div className="absolute right-3 top-3">
          <Badge>{funded_pct.toFixed(0)}% funded</Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3
          className="mb-2 text-lg font-semibold text-gray-900 
                      line-clamp-2 group-hover:text-blue-600"
        >
          {title}
        </h3>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`h-4 w-4 ${
                star <= Math.round(avg_rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-sm text-gray-500">
            {avg_rating.toFixed(1)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${Math.min(funded_pct, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
