import React, { useState, useEffect } from 'react';
import { useNode } from "@craftjs/core";
import { Rnd } from "react-rnd";
import { Slider } from '@mui/material';

export const EmojiComponent = ({ emoji, width = 100, positions }) => {
  const { connectors: { connect, drag }, actions: { setProp }  } = useNode();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width, height: 'auto' });

  useEffect(() => {
    setSize({ width, height: 'auto' });
  }, [width]);

  const onResizeStop = (e, direction, ref, delta, position) => {
    setProp(props => {
        props.width = ref.style.width;
        props.height = ref.style.height;
    });
};

const onDragStop = (e, d) => {
    setProp(props => {
        props.positions = { x: d.x, y: d.y };
    });
};

  return (
    <Rnd
      size={size}
      position={position}
      bounds="parent"
      onResizeStop={onResizeStop}
      onDragStop={onDragStop}
      style={{ zIndex: 1 }}
      dragHandleClassName="drag-handle"
      enableUserSelectHack={true}
      onDragStart={(e, d) => {
        console.log('Drag started at:', d.x, d.y);
      }}
      onDrag={(e, d) => {
        setPosition({ x: d.x, y: d.y });
      }}
      onResize={(e, direction, ref, delta, position) => {
        setSize({
          width: ref.style.width,
          height: 'auto',
        });
        setPosition(position);
      }}
    >
      <div ref={ref => connect(drag(ref))} className="w-full h-full flex items-center justify-center drag-handle" style={{ fontSize: `${size.width}px` }}>
        {emoji}
      </div>
    </Rnd>
  );
};

export const EmojiSettings = () => {
  const { actions: { setProp }, width } = useNode((node) => ({
    width: node.data.props.width,
    emoji: node.data.props.emoji
  }));

  const handleWidthChange = (value) => {
    setProp((props) => props.width = value);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-100">Emoji Width</label>
      <Slider
        value={width ? parseInt(width, 10) : 100}
        onChange={(e, value) => handleWidthChange(value.toString())}
        step={1}
        min={10}
        max={200}
        valueLabelDisplay="auto"
      />
      <input
        value={width ? parseInt(width, 10) : 100}
        onChange={(e) => handleWidthChange(e.target.value)}
        type="number"
        className={`w-12 h-7 border border-gray-300 text-zinc-900 rounded-md py-2 px-1`}
      />
    </div>
  );
}

EmojiComponent.craft = {
  displayName: 'Emoji',
  rules: {
    canDrag: () => false
  },
  related: {
    settings: EmojiSettings
  }
};

export default EmojiComponent;