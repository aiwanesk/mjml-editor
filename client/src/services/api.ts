const API_BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
  } catch {
    throw new Error("Impossible de contacter le serveur. Vérifiez que le serveur est bien lancé.");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erreur réseau" }));
    throw new Error(error.message || `Erreur ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(url: string, body?: unknown) =>
    request<T>(url, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
  upload: async <T>(url: string, formData: FormData): Promise<T> => {
    let res: Response;
    try {
      res = await fetch(`${API_BASE}${url}`, {
        method: "POST",
        body: formData,
      });
    } catch {
      throw new Error("Impossible de contacter le serveur. Vérifiez que le serveur est bien lancé.");
    }
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Erreur réseau" }));
      throw new Error(error.message || `Erreur ${res.status}`);
    }
    return res.json();
  },
};
