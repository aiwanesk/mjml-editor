import { api } from "./api";
import type { Template } from "@/types/template";
import type { MjmlNode } from "@/types/mjml";

export const templateApi = {
  list: () => api.get<Template[]>("/templates"),

  getById: (id: string) => api.get<Template>(`/templates/${id}`),

  upload: (file: File, name?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (name) formData.append("name", name);
    return api.upload<Template>("/templates/upload", formData);
  },

  create: (name: string, mjmlJson: MjmlNode) =>
    api.post<Template>("/templates", { name, mjmlJson }),

  save: (id: string, mjmlJson: MjmlNode, name?: string) =>
    api.put<Template>(`/templates/${id}`, { mjmlJson, name }),

  delete: (id: string) => api.delete<{ message: string }>(`/templates/${id}`),

  getVersions: (id: string) => api.get<unknown[]>(`/templates/${id}/versions`),
};
