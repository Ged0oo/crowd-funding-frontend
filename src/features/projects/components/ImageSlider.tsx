import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { ImageSliderProps } from "../../../types/projects";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  if (images.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl bg-gray-100">
        <p className="text-gray-400">No images available</p>
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
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop={images.length > 1}
      className="h-80 overflow-hidden rounded-xl"
    >
      {images.map((img) => (
        <SwiperSlide key={img.id}>
          <img
            src={img.image}
            alt="Project"
            className="h-full w-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;
export type { ImageSliderProps };
