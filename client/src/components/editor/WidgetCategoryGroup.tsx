import type { Widget } from "@/types/widget";
import { WidgetItem } from "./WidgetItem";

interface WidgetCategoryGroupProps {
  name: string;
  widgets: Widget[];
}

export function WidgetCategoryGroup({ name, widgets }: WidgetCategoryGroupProps) {
  return (
    <div>
      <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">{name}</h4>
      <div className="grid grid-cols-2 gap-2">
        {widgets.map((widget) => (
          <WidgetItem key={widget.id} widget={widget} />
        ))}
      </div>
    </div>
  );
}
