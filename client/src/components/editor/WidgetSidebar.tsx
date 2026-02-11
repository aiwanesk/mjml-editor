import { getWidgetCategories } from "@/lib/widget-defaults";
import { WidgetCategoryGroup } from "./WidgetCategoryGroup";

export function WidgetSidebar() {
  const categories = getWidgetCategories();

  return (
    <div className="p-4">
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
        Widgets
      </h3>
      <div className="space-y-4">
        {categories.map((cat) => (
          <WidgetCategoryGroup key={cat.name} name={cat.name} widgets={cat.widgets} />
        ))}
      </div>
    </div>
  );
}
