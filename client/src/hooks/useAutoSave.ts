import { useEffect, useRef, useState, useCallback } from "react";
import { templateApi } from "@/services/templateApi";
import type { MjmlNode } from "@/types/mjml";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export function useAutoSave(
  templateId: string | undefined,
  mjmlJson: MjmlNode | null,
  intervalMs = 30000
) {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const lastSavedRef = useRef<string>("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const save = useCallback(async () => {
    if (!templateId || !mjmlJson) return;

    const currentJson = JSON.stringify(mjmlJson);
    if (currentJson === lastSavedRef.current) {
      setStatus("saved");
      return;
    }

    setStatus("saving");
    try {
      await templateApi.save(templateId, mjmlJson);
      lastSavedRef.current = currentJson;
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, [templateId, mjmlJson]);

  const manualSave = useCallback(async () => {
    await save();
  }, [save]);

  // Track changes
  useEffect(() => {
    if (!mjmlJson) return;
    const currentJson = JSON.stringify(mjmlJson);
    if (currentJson !== lastSavedRef.current && lastSavedRef.current !== "") {
      setStatus("unsaved");
    }
  }, [mjmlJson]);

  // Initialize lastSaved
  useEffect(() => {
    if (mjmlJson && lastSavedRef.current === "") {
      lastSavedRef.current = JSON.stringify(mjmlJson);
    }
  }, [mjmlJson]);

  // Auto-save timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      save();
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [save, intervalMs]);

  return { status, save: manualSave };
}
