const API_BASE = "/api";

export const exportApi = {
  downloadHtml: async (templateId: string, templateName: string) => {
    const res = await fetch(`${API_BASE}/export/${templateId}/html`);
    if (!res.ok) throw new Error("Erreur lors de l'export HTML");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  },

  downloadPng: async (templateId: string, templateName: string) => {
    const res = await fetch(`${API_BASE}/export/${templateId}/png`);
    if (!res.ok) throw new Error("Erreur lors de l'export PNG");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateName}.png`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
