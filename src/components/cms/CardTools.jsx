"use client";
import React, { forwardRef, useState } from 'react';
import { useEditor } from "@craftjs/core";
import { Header } from "./user/Header";
import { ImageUpload } from "./user/ImageUpload";
import { TwoColumnContainer } from "./user/gridlayouts/TwoColumnContainer";
import { ThreeColumnContainer } from "./user/gridlayouts/ThreeColumnContainer";
import { Square } from "lucide-react";
import simpleBlue from '../../assets/simple-blue.png';
import GetEmojis from './user/GetEmojis';
import { EmojiComponent } from './user/EmojiComponent';

const DraggableButton = forwardRef((props, ref) => (
  <button ref={ref} {...props} />
));
DraggableButton.displayName = 'DraggableButton';

export const CardTools = () => {
  const { connectors } = useEditor();
  const [sectionTab, setSectionTab] = useState('components');
  const [showEmojis, setShowEmojis] = useState(false); // State to control visibility of GetEmojis

  return (
    <div className="py-6">
      <div className="flex flex-col items-center space-y-2">
        <div className='flex items-center text-base gap-1'>
          <button onClick={() => setSectionTab('components')} className={`shadow-sm p-2 ${sectionTab === 'components' ? 'bg-blue-500 text-white' : 'bg-blue-600 opacity-30 text-white'}`}>Components</button>
          <button onClick={() => setSectionTab('layouts')} className={`shadow-sm p-2 ${sectionTab === 'layouts' ? 'bg-blue-500 text-white' : 'bg-blue-600 opacity-30 text-white'}`}>Layouts</button>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-1">
        {sectionTab === 'layouts' && (
          <>
            <span className="text-base font-medium text-gray-950 pt-2">Grid Containers Selection</span>
            <div className="flex justify-center items-center w-fit h-auto gap-1 text-sm ">
              <DraggableButton ref={ref => { if (ref) connectors.create(ref, <TwoColumnContainer background="#fff" padding={10} />); }} className="btn-gradient p-1 grid grid-cols-2 justify-items-center place items-stretch gap-0 rounded "><Square className='text-gray-950' size={32} /><Square className='text-gray-950' size={32} /></DraggableButton>
              <DraggableButton ref={ref => { if (ref) connectors.create(ref, <ThreeColumnContainer background="#fff" padding={5} />); }} className="btn-gradient p-1 justify-items-center grid grid-cols-3 rounded"><Square className='text-gray-950' size={32}/><Square className='text-gray-950' size={32} /><Square className='text-gray-950' size={32} /></DraggableButton>
            </div>
          </>
        )}
        {sectionTab === 'components' && (
          <>
            <div className="flex flex-col items-center gap-y-2 w-full text-nowrap text-sm pt-8">
              <DraggableButton ref={ref => { if (ref) connectors.create(ref, <Header text="Text" />); }} className="p-2 btn-gradient rounded text-center w-full">Text</DraggableButton>  
              <DraggableButton ref={ref => { if (ref) connectors.create(ref, <ImageUpload src={simpleBlue} alt="" width={200} height={200} overlayOpacity={0} />); }} className="p-2 btn-gradient rounded text-center w-full">Image Upload</DraggableButton>
              <DraggableButton ref={ref => { if (ref) connectors.create(ref, <EmojiComponent />); }} className="p-2 btn-gradient rounded text-center w-full" onClick={() => setShowEmojis(!showEmojis)}>Emoji</DraggableButton>
            </div>
            {showEmojis && (
              <div className="pt-4">
                <GetEmojis />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};