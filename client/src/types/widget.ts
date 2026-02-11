import type { MjmlNode } from "./mjml";

export interface Widget {
  id: string;
  name: string;
  category: string;
  icon: string;
  defaultNode: MjmlNode;
}

export interface WidgetCategory {
  name: string;
  widgets: Widget[];
}
