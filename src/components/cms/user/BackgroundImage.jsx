"use client";
import React, { useRef, useEffect } from "react";
import { useNode } from "@craftjs/core";
import defaultImage from "../../../assets/default-image.jpg";

export const BackgroundImage = ({ src = defaultImage, alt = '', width = 'auto', height = 'auto', objectFit = 'contain', objectPosition = 'center', overlayColor = 'transparent', overlayOpacity = 0.9, children }) => {
  const { connectors: { connect } } = useNode();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      connect(ref.current);
    }
  }, [connect]);

  return (
    <div
      ref={ref}
      style={{
        width,
        height,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <img
          src={src || defaultImage}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit, objectPosition }}
          className="-z-50"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity, zIndex: 1 }}
        />
        <div className="absolute inset-0 z-20">
          {children}
        </div>
      </div>
    </div>
  );
};

BackgroundImage.craft = {
  displayName: 'Background Image',
};