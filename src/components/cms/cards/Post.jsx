"use client";
import React, { useRef, useEffect, useState } from "react";
import { useNode } from "@craftjs/core";
import defaultImage from "../../../assets/default-image.jpg";
import { BackgroundImage } from "../user/BackgroundImage";
import FetchImages from "../user/FetchImages";

export const Post = ({ background, padding = 0, borderColor = 'gray-400', containerType, img = defaultImage, alt, objectFit = 'contain', objectPosition = 'center', overlayColor = '#ffffff', overlayOpacity = 0.9, children }) => {
  const { connectors: { connect } } = useNode();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      connect((ref.current));
    }
  }, [connect]);

  const isFacebook = containerType === 'facebook';

  const containerStyles = {
    background,
    padding: `${padding}px`,
    borderColor,
    height: isFacebook ? '400px' : '900px',
    width: isFacebook ? '800px' : '1150px',
    maxWidth: isFacebook ? '800px' : '1150px',
    maxHeight: isFacebook ? '400px' : '900px',
  };
  
  return (    
    <div
      ref={ref}
      style={containerStyles}
      className={`w-full h-full`}
    >     
      <BackgroundImage 
        className="-z-10 relative top-0" 
        id="image" 
        src={img}
        alt={alt}
        objectFit={objectFit} 
        objectPosition={objectPosition} 
        overlayColor={overlayColor} 
        overlayOpacity={overlayOpacity} 
        width={isFacebook ? '800px' : '1150px'} 
        height={isFacebook ? '400px' : '900px'}
      >
        <div className="flex justify-center w-full">{children}</div>
      </BackgroundImage>
    </div>
  );
};

export const PostSettings = () => {
  const { actions: { setProp }, background, padding, gap, img, objectFit, overlayColor, overlayOpacity } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    height: node.data.props.height,
    width: node.data.props.width,
    gap: node.data.props.gap,
    img: node.data.props.img,
    objectFit: node.data.props.objectFit,
    objectPosition: node.data.props.objectPosition,
    overlayColor: node.data.props.overlayColor,
    overlayOpacity: node.data.props.overlayOpacity,
  }));

  const [showImageLibrary, setShowImageLibrary] = useState(false);

  const handleSelectImage = (url) => {
    setProp((props) => {
      props.img = url;
      props.width = 'auto';
      props.height = 'auto';
    });
    setShowImageLibrary(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProp((props) => {
          props.img = reader.result;
          props.width = 'auto';
          props.height = 'auto';
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProp((props) => {
      props.img = defaultImage;
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="block text-sm font-medium text-gray-100">Background Color</label>
        <input type="color" value={background} onChange={(e) => setProp((props) => props.background = e.target.value)} className="w-full h-6 border border-gray-300 rounded-md" />
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="block text-sm font-medium text-gray-100">Padding</label>
        <input type="number" value={padding} onChange={(e) => setProp((props) => props.padding = e.target.value)} className="w-full h-6 border border-gray-300 rounded-md" />
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="block text-sm font-medium text-gray-100">Gap</label>
        <input type="number" value={gap} onChange={(e) => setProp((props) => props.gap = e.target.value)} className="w-full h-6 border border-gray-300 rounded-md" />
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="block text-sm font-medium text-gray-100">Image URL</label>
        <input
          type="text"
          value={img}
          onChange={(e) => setProp((props) => props.img = e.target.value)}
          className="w-full text-gray-950"
        />
        <span className="text-gray-950">
          <button
            type="button"
            onClick={() => setShowImageLibrary(!showImageLibrary)}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            {showImageLibrary ? 'Hide Image Library' : 'Show Image Library'}
          </button>
          {showImageLibrary && <FetchImages onSelectImage={handleSelectImage} />}
        </span>
        <label className="block text-sm font-medium text-gray-100">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full text-gray-50"
        />
        <button
          type="button"
          onClick={handleRemoveImage}
          className="w-full bg-red-500 text-white py-2 rounded mt-2"
        >
          Remove Image
        </button>
        <label className="block text-sm font-medium text-gray-100">Overlay Color</label>
        <input
          type="color"
          value={overlayColor}
          onChange={(e) => setProp((props) => props.overlayColor = e.target.value)}
          className="w-full text-gray-950"
        />
        <label className="block text-sm font-medium text-gray-100">Overlay Opacity</label>
        <input
          type="number"
          value={overlayOpacity}
          min="0"
          max="1"
          step="0.1"
          onChange={(e) => setProp((props) => props.overlayOpacity = e.target.value)}
          className="w-full text-gray-950"
        />
        <label className="block text-sm font-medium text-gray-100">Object Fit</label>
        <select
          value={objectFit}
          onChange={(e) => setProp((props) => props.objectFit = e.target.value)}
          className="w-full text-gray-950"
        >
          <option value="contain">Contain</option>
          <option value="cover">Cover</option>
        </select>
      </div>
    </div>
  );
};

Post.craft = {
  props: {
    gap: 0,
    overlayOpacity: 0.7,
    overlayColor: "#000000",
  },
  related: {
    settings: PostSettings,
  },
  displayName: "Canvas",
  rules: {
    canDrag: () => false,
  },
};