import { useState, useRef, useEffect } from "react";
import { Download, FileCode, Image } from "lucide-react";
import { toast } from "sonner";
import { exportApi } from "@/services/exportApi";

interface ExportMenuProps {
  templateId: string;
  templateName: string;
}

export function ExportMenu({ templateId, templateName }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleExport = async (type: "html" | "png") => {
    setLoading(type);
    try {
      if (type === "html") {
        await exportApi.downloadHtml(templateId, templateName);
      } else {
        await exportApi.downloadPng(templateId, templateName);
      }
      toast.success(`Export ${type.toUpperCase()} réussi`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'export");
    } finally {
      setLoading(null);
      setOpen(false);
    }
  };

  return (
    <div ref={menuRef} className="relative" data-tour="export">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
      >
        <Download className="h-4 w-4" />
        Exporter
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => handleExport("html")}
            disabled={!!loading}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <FileCode className="h-4 w-4" />
            {loading === "html" ? "Export en cours..." : "Exporter en HTML"}
          </button>
          <button
            onClick={() => handleExport("png")}
            disabled={!!loading}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Image className="h-4 w-4" />
            {loading === "png" ? "Export en cours..." : "Exporter en PNG"}
          </button>
        </div>
      )}
    </div>
  );
}
