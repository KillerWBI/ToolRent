"use client";

import { Tool } from "@/types/tool";
import css from "./ToolGallery.module.css";
import { useState } from "react";
import { useToolImages } from "@/hooks/useToolImages";

type ToolGalleryProps = {
  tool: Tool;
};

export const ToolGallery = ({ tool }: ToolGalleryProps) => {
  const { allImages, isFromArray } = useToolImages(tool);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentImage =
    allImages[selectedIndex] || "/image/Placeholder Image.png";

  const handleThumbnailClick = (index: number) => {
    if (index === selectedIndex) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className={css.gallery}>
      <div
        className={`${css.imgWrap} ${isFromArray ? css.imgWrapArray : ""} ${
          isTransitioning ? css.transitioning : ""
        }`}
      >
        <img
          className={`${css.image} ${isFromArray ? css.imageArray : ""}`}
          src={currentImage}
          alt={tool.name}
        />
      </div>

      {isFromArray && allImages.length > 1 && (
        <div className={css.thumbnailsContainer}>
          <div className={css.thumbnails}>
            {allImages.map((img, index) => (
              <button
                key={index}
                className={`${css.thumbnail} ${
                  index === selectedIndex ? css.thumbnailActive : ""
                }`}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={img} alt={`${tool.name} - Image ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
