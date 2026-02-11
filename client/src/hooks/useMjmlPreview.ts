import { useState, useEffect, useRef, useCallback } from "react";
import { compileApi } from "@/services/compileApi";
import type { MjmlNode } from "@/types/mjml";

export function useMjmlPreview(mjmlJson: MjmlNode | null) {
  const [html, setHtml] = useState<string>("");
  const [compiling, setCompiling] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const compile = useCallback(async (ast: MjmlNode) => {
    setCompiling(true);
    try {
      const result = await compileApi.compile(ast);
      setHtml(result.html);
    } catch (err) {
      console.error("Compilation error:", err);
    } finally {
      setCompiling(false);
    }
  }, []);

  useEffect(() => {
    if (!mjmlJson) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      compile(mjmlJson);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [mjmlJson, compile]);

  return { html, compiling };
}
