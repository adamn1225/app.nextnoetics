"use client";
import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import ContentEditable from 'react-contenteditable';
import { Slider } from '@mui/material';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { Rnd } from "react-rnd";

export const Header = ({ text, fontSize, textAlign, color, fontWeight, fontStyle, tagName, position }) => {
    const { connectors: { connect, drag }, actions: { setProp } } = useNode();

    const onResizeStop = (e, direction, ref, delta, position) => {
        setProp(props => {
            props.width = ref.style.width;
            props.height = ref.style.height;
        });
    };

    const onDragStop = (e, d) => {
        setProp(props => {
            props.position = { x: d.x, y: d.y };
        });
    };

    return (
        <Rnd
            size={{ width: 'auto', height: 'auto' }}
            position={position}
            onResizeStop={onResizeStop}
            onDragStop={onDragStop}
            style={{ zIndex: 1 }}
            enableResizing={{ top: false, right: true, bottom: false, left: true }}
            enableUserSelectHack={false}
            disableDragging={false}
        >
            <div
                ref={ref => { if (ref) connect(drag(ref)); }}
                style={{ fontSize, textAlign, color, fontWeight, fontStyle }}
            >
                <ContentEditable
                    html={text}
                    onChange={e =>
                        setProp((props) =>
                            props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")
                        )
                    }
                    tagName={tagName}
                    style={{ fontSize, textAlign, color, fontWeight, fontStyle, border: '', padding: '0 4px' }}
                />
            </div>
        </Rnd>
    )
};

export const HeaderSettings = () => {
    const { actions: { setProp }, fontSize, color, fontWeight, fontStyle } = useNode((node) => ({
        fontSize: node.data.props.fontSize,
        textAlign: node.data.props.textAlign,
        color: node.data.props.color,
        fontWeight: node.data.props.fontWeight,
        fontStyle: node.data.props.fontStyle,
        tagName: node.data.props.tagName
    }));
    const [activeTab, setActiveTab] = useState('styling');
    const [unit, setUnit] = useState('px');

    const handleFontSizeChange = (value) => {
        setProp((props) => props.fontSize = value + unit);
    };

    const handleUnitChange = (e) => {
        const newUnit = e.target.value;
        setUnit(newUnit);
        setProp((props) => props.fontSize = parseInt(fontSize, 10) + newUnit);
    };

    const handleColorChange = (e) => {
        setProp((props) => props.color = e.target.value);
    };

    const handleFontWeightChange = (e) => {
        setProp((props) => props.fontWeight = e.target.value);
    };

    const handleFontStyleChange = (e) => {
        setProp((props) => props.fontStyle = e.target.value);
    };

    const handleTextAlignChange = (align) => {
        setProp((props) => props.textAlign = align);
    };

    return (
        <div>
            <div className="flex justify-center space-x-2 text-gray-100">
                <button
                    onClick={() => setActiveTab('styling')}
                    className={`px-2 py-1 rounded-md ${activeTab === 'styling' ? 'bg-gray-200 text-zinc-900' : 'bg-gray-400 text-zinc-900'}`}
                >
                    Styling
                </button>
                <button
                    onClick={() => setActiveTab('css')}
                    className={`px-2 py-1 rounded-md ${activeTab === 'css' ? 'bg-gray-200 text-zinc-900' : 'bg-gray-400 text-zinc-900'}`}
                >
                    Insert CSS
                </button>
            </div>
            <div className={activeTab === 'styling' ? 'space-y-2 mt-6' : 'hidden'}>
                <div className="flex items-center justify-center gap-1">
                    <div className="flex items-center justify-stretch w-full gap-2">
                        <label className="w-full font-semibold text-sm underline text-gray-100">Font Size
                            <Slider
                                value={fontSize ? parseInt(fontSize, 10) : 0}
                                onChange={(e, value) => handleFontSizeChange(value.toString())}
                                step={1}
                                min={7}
                                max={100}
                                valueLabelDisplay="auto"
                            />
                        </label>
                        <input
                            value={fontSize ? parseInt(fontSize, 10) : 0}
                            onChange={(e) => handleFontSizeChange(e.target.value)}
                            type="number"
                            className={`w-12 h-7 border border-gray-300 text-zinc-900 rounded-md py-2 px-1`}
                        />
                        <select
                            value={unit}
                            onChange={handleUnitChange}
                            className="border border-gray-300 bg-white text-zinc-900 rounded-md p-1"
                        >
                            <option value="px">px</option>
                            <option value="em">em</option>
                            <option value="rem">rem</option>
                            <option value="%">%</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-start items-center gap-3">

                    <div className="flex flex-col items-center justify-center gap-1">
                        <label className=" font-semibold text-sm text-gray-100">Font Weight</label>
                        <select
                            value={fontWeight}
                            onChange={handleFontWeightChange}
                            className="border border-gray-300 rounded-sm p-1 text-zinc-900"
                        >
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                            <option value="bolder">Bolder</option>
                            <option value="lighter">Lighter</option>
                        </select>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                        <label className=" font-semibold text-sm text-gray-100">Font Style</label>
                        <select
                            value={fontStyle}
                            onChange={handleFontStyleChange}
                            className="border border-gray-300 rounded-md p-1 text-zinc-900"
                        >
                            <option value="normal">Normal</option>
                            <option value="italic">Italic</option>
                            <option value="oblique">Oblique</option>
                        </select>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                        <label className=" text-sm font-semibold text-gray-100">Color</label>
                        <input className="w-6" type="color" value={color} onChange={handleColorChange} />
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2"></div>
                <div className="flex flex-col items-center gap-2">
                    <label className="font-semibold underline text-lg text-gray-100">Text Alignment</label>
                    <div className="flex space-x-4">
                        <button className="bg-zinc-950 px-2 py-1 text-gray-100 rounded-md shadow-sm shadow-secondary" onClick={() => handleTextAlignChange('left')}><AlignLeft /></button>
                        <button className="bg-zinc-950 px-2 py-1 text-gray-100 rounded-md shadow-sm shadow-secondary" onClick={() => handleTextAlignChange('center')}><AlignCenter /></button>
                        <button className="bg-zinc-950 px-2 py-1 text-gray-100 rounded-md shadow-sm shadow-secondary" onClick={() => handleTextAlignChange('right')}><AlignRight /></button>
                    </div>
                </div>
            </div>
            <div className={activeTab === 'css' ? 'flex flex-col gap-1' : 'hidden'}>
                <label className="font-semibold text-sm underline">Custom Class</label>
                <input
                    type="text"
                    className="border border-gray-300 rounded-md p-1"
                />
                <label className="font-semibold text-sm underline">Custom CSS</label>
                <textarea
                    className="border border-gray-300 rounded-md p-1"
                    style={{ resize: 'none', height: '100px' }}
                />
            </div>
        </div>
    )
};

Header.craft = {
    displayName: 'Text',
    props: { text: 'Header', fontSize: '20px', textAlign: 'center', color: '#fff', fontWeight: 'normal', fontStyle: 'normal', tagName: 'p', position: { x: 0, y: 0 } },
    related: {
        settings: HeaderSettings
    },
    rules: {
        canDrag: () => false
    }
};