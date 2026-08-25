import React, { MutableRefObject } from "react";
import {
  useKeenSlider,
  KeenSliderPlugin,
  KeenSliderInstance,
} from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Image } from "@heroui/react";

interface PropertyImageProps {
  images: string[];
}

const ThumbnailPlugin = (
  mainRef: MutableRefObject<KeenSliderInstance | null>,
): KeenSliderPlugin => {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }
    function addActive(idx: number) {
      slider.slides[idx].classList.add("active");
    }
    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }
    slider.on("created", () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
};

export default function PropertyImageSlider({ images }: PropertyImageProps) {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
  });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: { perView: 4, spacing: 10 },
    },
    [ThumbnailPlugin(instanceRef)],
  );

  return (
    <>
      {images.length === 0 ? (
        <>
          <div className="max-w-screen-md mx-auto text-center">
            <Image
              src="https://infinitech-api27.site/no-image.jpg"
              alt="No Image"
              className="w-full h-64 object-cover object-center"
            />
            <small>No available image</small>
          </div>
        </>
      ) : (
        <>
          <div className="w-full flex justify-center">
            <div ref={sliderRef} className="keen-slider max-w-screen-md">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`keen-slider__slide number-slide${index}`}
                >
                  <Image
                    src={`https://infinitech-api27.site/properties/images/${image}`}
                    alt={`Property image ${index + 1}`}
                    className="w-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div
              ref={thumbnailRef}
              className="keen-slider thumbnail mt-2 max-w-screen-md"
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`keen-slider__slide number-slide${index}`}
                >
                  <Image
                    src={`https://infinitech-api27.site/properties/images/${image}`}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-24 object-cover object-center cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
