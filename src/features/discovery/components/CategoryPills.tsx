import { Link } from "react-router-dom";
import type { Category } from "../../../types/projects";

const categoryIcons: Record<string, string> = {
  technology: "devices",
  tech: "devices",
  art: "palette",
  arts: "palette",
  charity: "volunteer_activism",
  food: "restaurant",
  film: "movie",
  music: "music_note",
  energy: "solar_power",
  education: "school",
  health: "health_and_safety",
  sports: "sports_soccer",
  environment: "eco",
  real_estate: "home_work",
  fashion: "checkroom",
  business: "business_center",
  community: "groups",
};

function getIcon(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, "_");
  return categoryIcons[key] ?? "category";
}

interface CategoryPillsProps {
  categories: Category[];
}

export default function CategoryPills({ categories }: CategoryPillsProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="px-8 mb-6">
        <h2 className="text-2xl font-bold font-headline text-on-surface">Explore Categories</h2>
      </div>

      <div className="flex gap-6 overflow-x-auto px-8 no-scrollbar pb-4">
        {categories.map((category, idx) => (
          <Link
            key={category.id}
            to={`/categories/${category.slug}`}
            className="shrink-0 group cursor-pointer flex flex-col items-center"
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary transition-all ${
                idx === 0
                  ? "bg-emerald-50 border border-emerald-100"
                  : "bg-slate-100"
              }`}
            >
              <span
                className={`material-symbols-outlined text-3xl group-hover:text-white transition-colors ${
                  idx === 0 ? "text-primary" : "text-slate-500"
                }`}
              >
                {getIcon(category.name)}
              </span>
            </div>
            <p className="text-center font-bold text-sm text-on-surface-variant">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
