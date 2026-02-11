import { useState, useCallback, useEffect } from "react";
import type { MjmlNode } from "@/types/mjml";

const MAX_HISTORY = 50;

export function useUndoRedo(initialState: MjmlNode | null) {
  const [history, setHistory] = useState<MjmlNode[]>([]);
  const [future, setFuture] = useState<MjmlNode[]>([]);
  const [current, setCurrent] = useState<MjmlNode | null>(initialState);

  useEffect(() => {
    if (initialState && history.length === 0) {
      setCurrent(initialState);
    }
  }, [initialState]);

  const pushState = useCallback(
    (newState: MjmlNode) => {
      if (current) {
        setHistory((prev) => {
          const next = [...prev, current];
          if (next.length > MAX_HISTORY) next.shift();
          return next;
        });
      }
      setCurrent(newState);
      setFuture([]);
    },
    [current]
  );

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    if (current) {
      setFuture((f) => [current, ...f]);
    }
    setCurrent(prev);
  }, [history, current]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    if (current) {
      setHistory((h) => [...h, current]);
    }
    setCurrent(next);
  }, [future, current]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return {
    current,
    pushState,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
  };
}
