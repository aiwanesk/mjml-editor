import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Clock } from "lucide-react";
import type { Template } from "@/types/template";
import { compileApi } from "@/services/compileApi";

interface TemplateCardProps {
  template: Template;
  onDelete: (id: string) => void;
}

export function TemplateCard({ template, onDelete }: TemplateCardProps) {
  const navigate = useNavigate();

  const formattedDate = new Date(template.updatedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div
        className="aspect-[4/3] bg-gray-50 relative cursor-pointer overflow-hidden"
        onClick={() => navigate(`/editor/${template.id}`)}
      >
        <TemplatePreview mjmlJson={template.mjmlJson} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Clock className="h-3 w-3" />
              <span>{formattedDate}</span>
              <span className="ml-1">v{template.currentVersion}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(template.id);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function TemplatePreview({ mjmlJson }: { mjmlJson: Template["mjmlJson"] }) {
  const [html, setHtml] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    compileApi.compile(mjmlJson).then((result) => {
      if (!cancelled) setHtml(result.html);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!html) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="h-5 w-5 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <iframe
        srcDoc={html}
        className="absolute top-0 left-0 border-0"
        style={{
          width: "600px",
          height: "900px",
          transform: "scale(var(--preview-scale))",
          transformOrigin: "top left",
          pointerEvents: "none",
        }}
        tabIndex={-1}
        title="Aperçu"
        ref={(el) => {
          // Calculate scale based on container width
          if (el && containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            el.style.setProperty("--preview-scale", String(containerWidth / 600));
          }
        }}
      />
    </div>
  );
}
