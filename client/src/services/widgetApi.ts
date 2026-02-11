import { api } from "./api";
import type { WidgetCategory } from "@/types/widget";

export const widgetApi = {
  getAll: () => api.get<WidgetCategory[]>("/widgets"),
};
