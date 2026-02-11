import { useState, forwardRef } from "react";
import { PreviewFrame, type PreviewFrameHandle } from "./PreviewFrame";
import { DeviceSizeToggle } from "./DeviceSizeToggle";

interface PreviewPanelProps {
  html: string;
  compiling: boolean;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onHoverNode: (id: string | null) => void;
}

export const PreviewPanel = forwardRef<PreviewFrameHandle, PreviewPanelProps>(
  function PreviewPanel(
    { html, compiling, selectedNodeId, hoveredNodeId, onSelectNode, onHoverNode },
    ref
  ) {
    const [deviceWidth, setDeviceWidth] = useState(600);

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
          <span className="text-sm text-gray-500">
            {compiling ? "Compilation..." : "Aperçu"}
          </span>
          <DeviceSizeToggle value={deviceWidth} onChange={setDeviceWidth} />
        </div>
        <div className="flex-1 overflow-hidden">
          <PreviewFrame
            ref={ref}
            html={html}
            width={deviceWidth}
            selectedNodeId={selectedNodeId}
            hoveredNodeId={hoveredNodeId}
            onSelectNode={onSelectNode}
            onHoverNode={onHoverNode}
          />
        </div>
      </div>
    );
  }
);
