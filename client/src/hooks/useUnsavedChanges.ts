import { useEffect } from "react";
import type { SaveStatus } from "./useAutoSave";

export function useUnsavedChanges(status: SaveStatus) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (status === "unsaved" || status === "saving") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [status]);
}
