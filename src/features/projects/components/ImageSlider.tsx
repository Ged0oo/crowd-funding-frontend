import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  Thumbs,
  FreeMode,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { ImageSliderProps } from "../../../types/projects";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperType | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (images.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl bg-gray-100">
        <div className="text-center">
          <svg
            className="mx-auto mb-2 h-12 w-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-400">No images available</p>
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="overflow-hidden rounded-xl">
        <img
          src={images[0].image}
          alt="Project"
          className="h-80 w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Thumbs]}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 4000, disableOnInteraction: true }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        loop={images.length > 2}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-80 overflow-hidden rounded-xl md:h-96"
      >
        {images.map((img, index) => (
          <SwiperSlide key={img.id}>
            <img
              src={img.image}
              alt={`Project image ${index + 1}`}
              className="h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail strip */}
      {images.length > 2 && (
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={Math.min(images.length, 6)}
          freeMode
          watchSlidesProgress
          className="h-16 px-1"
        >
          {images.map((img, index) => (
            <SwiperSlide key={img.id} className="cursor-pointer">
              <img
                src={img.image}
                alt={`Thumbnail ${index + 1}`}
                className={`h-full w-full rounded-md object-cover transition-all
                  ${
                    activeIndex === index
                      ? "ring-2 ring-blue-500 ring-offset-1 opacity-100"
                      : "opacity-60 hover:opacity-80"
                  }`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Image counter */}
      <p className="text-center text-xs text-gray-400">
        {activeIndex + 1} / {images.length}
      </p>
    </div>
  );
};

export default ImageSlider;
export type { ImageSliderProps };
