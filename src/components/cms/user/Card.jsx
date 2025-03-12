"use client";
import React, { useRef, useEffect, useState } from "react";
import { Element, useNode } from "@craftjs/core";
import { Header } from "./Header";
import defaultImage from "../../../assets/default-image.jpg";
import FetchImages from "./FetchImages";

export const Card = ({ containerType, h1, h2, background, padding = 0, img = defaultImage, alt, objectFit = 'contain', objectPosition = 'center', overlayColor = '#ffffff', overlayOpacity = 0.8, children }) => {
    const { connectors: { connect, drag } } = useNode();
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            connect(drag(ref.current));
        }
    }, [connect, drag]);

    const isFacebook = containerType === 'facebook';

    const containerStyles = {
        background,
        padding: `${padding}px`,
        height: isFacebook ? '400px' : '900px',
        width: isFacebook ? '800px' : '1150px',
        maxWidth: isFacebook ? '800px' : '1150px',
        maxHeight: isFacebook ? '400px' : '900px',
        position: 'relative',
    };

    return (    
        <div
        ref={ref}
        style={containerStyles}
        className='w-full h-full'
    >          
            <div className="flex flex-col gap-12">
              <div className="">
                <Element is={Header} text={h1 || "Company Logo"} id="title" background={background} fontSize={isFacebook ? 40 : 32} />
              </div>
              <div className="">
                <Element is={Header} text={h2 || "Subtitle"} textAlign={'center'} fontSize={isFacebook ? 24 : 24} id="subtitle" background={background} />
              </div>
            </div>
            </div>
    );
};

export const CardSettings = () => {
    const { actions: { setProp }, background, objectFit, overlayColor, overlayOpacity } = useNode((node) => ({
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
          <span className="text-zinc-900">
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
            className="w-full text-zinc-900"
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

Card.craft = {
    displayName: "Card",
    props: {
        gap: 0,
        overlayOpacity: 0.9,
        overlayColor: "#000000",
      },
    related: {
        settings: CardSettings
    },
    rules: {
        canDrag: () => true
    }
};