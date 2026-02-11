import { useState, useCallback } from "react";

export function useEditorSelection() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const selectNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
  }, []);

  const hoverNode = useCallback((id: string | null) => {
    setHoveredNodeId(id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
    setHoveredNodeId(null);
  }, []);

  return {
    selectedNodeId,
    hoveredNodeId,
    selectNode,
    hoverNode,
    clearSelection,
  };
}
