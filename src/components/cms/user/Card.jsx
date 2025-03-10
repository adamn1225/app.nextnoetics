"use client";
import React, { useRef, useEffect } from "react";
import { Element, useNode } from "@craftjs/core";
import { TextArea } from "./TextArea";
import { Header } from "./Header";
import { Button } from "./Button";

export const CardTop = ({ children }) => {
    const { connectors: { connect } } = useNode();
    return (
        <div ref={connect} className="text-only">
            {children}
        </div>
    );
};

CardTop.craft = {
    rules: {
        canMoveIn: (incomingNodes) => incomingNodes.every(incomingNode => 
            incomingNode.data.type === Header || 
            incomingNode.data.type === TextArea || 
            incomingNode.data.type === Button
        )
    }
};

export const Card = ({ containerType, h1, h2, background, padding = 0, borderColor = 'gray-400', height = '', gap = '4', layout = 'grid' }) => {
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
        borderColor,
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
            <div className="flex flex-col items-center justify-evenly gap-y-16 w-[700px] max-w-full">
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
    const { actions: { setProp }, background, padding, height, gap } = useNode((node) => ({
        background: node.data.props.background,
        padding: node.data.props.padding,
        height: node.data.props.height,
        gap: node.data.props.gap
    }));

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
                <label className="block text-sm font-medium text-gray-100">Height</label>
                <input type="text" value={height || ''} onChange={(e) => setProp((props) => props.height = e.target.value || 'auto')} className="w-full h-6 border border-gray-300 rounded-md" />
            </div>
            <div className="flex flex-col gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-100">Gap</label>
                <input type="number" value={gap} onChange={(e) => setProp((props) => props.gap = e.target.value)} className="w-full h-6 border border-gray-300 rounded-md" />
            </div>
        </div>
    );
};

Card.craft = {
    displayName: "Card",
    props: {
        padding: 20,
        gap: 0
    },
    related: {
        settings: CardSettings
    },
    rules: {
        canDrag: () => true
    }
};