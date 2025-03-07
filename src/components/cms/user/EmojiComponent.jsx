import React from 'react';
import { useNode } from "@craftjs/core";

const EmojiComponent = ({ emoji }) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div ref={ref => connect(drag(ref))} className="text-2xl">
      {emoji}
    </div>
  );
};

export default EmojiComponent;