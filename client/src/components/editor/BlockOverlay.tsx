import { DragOverlay } from "@dnd-kit/core";
import { widgetDefaults } from "@/lib/widget-defaults";

interface BlockOverlayProps {
  activeWidgetId: string | null;
}

export function BlockOverlay({ activeWidgetId }: BlockOverlayProps) {
  if (!activeWidgetId) return null;

  const widget = widgetDefaults.find((w) => w.id === activeWidgetId);
  if (!widget) return null;

  return (
    <DragOverlay>
      <div className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg shadow-lg">
        {widget.name}
      </div>
    </DragOverlay>
  );
}
