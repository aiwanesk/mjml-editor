import { useDraggable } from "@dnd-kit/core";
import {
  Type,
  Image,
  MousePointer,
  Minus,
  MoveVertical,
  Share2,
  LayoutTemplate,
  Columns2,
  Columns3,
} from "lucide-react";
import type { Widget } from "@/types/widget";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Type,
  Image,
  MousePointer,
  Minus,
  MoveVertical,
  Share2,
  LayoutTemplate,
  Columns2,
  Columns3,
};

interface WidgetItemProps {
  widget: Widget;
}

export function WidgetItem({ widget }: WidgetItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `widget-${widget.id}`,
    data: { widgetId: widget.id, type: "widget" },
  });

  const Icon = ICONS[widget.icon] || Type;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:bg-indigo-50 transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Icon className="h-5 w-5 text-gray-600" />
      <span className="text-xs text-gray-600 text-center">{widget.name}</span>
    </div>
  );
}
