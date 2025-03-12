import { useEffect } from 'react';
import { useEditor } from "@craftjs/core";

const InitializeCardSelection = () => {
  const { actions, query } = useEditor();

  useEffect(() => {
    // Find the node ID of the Card component
    const cardNodeId = Object.values(query.getNodes()).find(node => node.data.displayName === 'Card')?.id;

    if (cardNodeId) {
      // Programmatically select the Card component when the page loads
      actions.selectNode(cardNodeId);
    }
  }, [actions, query]);

  return null;
};

export default InitializeCardSelection;