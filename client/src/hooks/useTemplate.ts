import { useState, useEffect, useCallback } from "react";
import { templateApi } from "@/services/templateApi";
import type { Template } from "@/types/template";

export function useTemplate(id: string | undefined) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplate = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await templateApi.getById(id);
      setTemplate(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  return { template, setTemplate, loading, error, refresh: fetchTemplate };
}
