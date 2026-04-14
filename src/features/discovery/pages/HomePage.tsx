import { useHomepage } from "../hooks/useHomepage";
import HeroSlider from "../components/HeroSlider";
import CategoryPills from "../components/CategoryPills";
import ProjectGrid from "../components/ProjectGrid";
import BentoGrid from "../components/BentoGrid";
import Spinner from "../../../shared/components/ui/Spinner";

export default function HomePage() {
  const { data, isLoading, isError } = useHomepage();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center py-32">
        <p className="text-on-surface-variant">Could not load home page</p>
      </div>
    );
  }

  return (
    <div className="-mx-6">
      <HeroSlider projects={data.top5_rated} />

      <CategoryPills categories={data.categories} />

      {/* Featured campaigns */}
      <section className="px-8 mb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
              Curated Selection
            </span>
            <h2 className="text-4xl font-black font-headline text-on-surface">
              Featured Campaigns
            </h2>
          </div>
          <button className="text-primary font-bold flex items-center gap-2 group hover:underline underline-offset-4">
            View all projects
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
        <ProjectGrid projects={data.featured5} />
      </section>

      {/* Freshly launched*/}
      <section className="px-8 mb-24 bg-surface-container-low py-20 -mx-8">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="mb-12">
            <span className="text-tertiary font-bold tracking-widest text-xs uppercase mb-2 block">
              New Arrivals
            </span>
            <h2 className="text-4xl font-black font-headline text-on-surface">
              Freshly Launched
            </h2>
          </div>
          <BentoGrid projects={data.latest5} />
        </div>
      </section>
    </div>
  );
}
