import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { ProjectCardProps } from "../../../types/projects";
import "swiper/css";
import "swiper/css/pagination";

interface HeroSliderProps {
  projects: ProjectCardProps[];
}

export default function HeroSlider({ projects }: HeroSliderProps) {
  if (projects.length === 0) return null;

  return (
    <section className="px-8 mb-16">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={projects.length > 1}
        className="w-full aspect-21/9 rounded-[2.5rem] overflow-hidden shadow-2xl hero-swiper"
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
            <div className="relative w-full h-full">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary to-primary-container" />
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-16">
                <div className="max-w-2xl">
                  <span className="inline-block bg-primary-container text-on-primary-container text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
                    Top Rated
                  </span>
                  <h1 className="text-5xl md:text-6xl font-black font-headline text-white mb-6 leading-tight">
                    {project.title}
                  </h1>
                  <p className="text-lg text-white/90 mb-8 font-body max-w-xl">
                    {project.category} &bull; {project.funded_pct}% funded
                  </p>
                  <div className="flex gap-4">
                    <Link
                      to={`/projects/${project.id}`}
                      className="bg-linear-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                    >
                      Back this Project
                    </Link>
                    <Link
                      to={`/projects/${project.id}`}
                      className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
