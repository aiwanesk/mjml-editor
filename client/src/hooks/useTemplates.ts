import { useState, useEffect, useCallback } from "react";
import { templateApi } from "@/services/templateApi";
import type { Template } from "@/types/template";

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const data = await templateApi.list();
      setTemplates(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const uploadTemplate = useCallback(async (file: File) => {
    const template = await templateApi.upload(file);
    setTemplates((prev) => [template, ...prev]);
    return template;
  }, []);

  const deleteTemplate = useCallback(async (id: string) => {
    await templateApi.delete(id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    templates,
    loading,
    error,
    refresh: fetchTemplates,
    uploadTemplate,
    deleteTemplate,
  };
}
