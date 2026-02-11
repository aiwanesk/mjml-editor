import { Widget } from "./Widget.js";
import { WidgetCategory } from "./WidgetCategory.js";

export interface IWidgetRepository {
  getAllCategories(): WidgetCategory[];
  findById(id: string): Widget | undefined;
}
