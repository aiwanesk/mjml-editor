import { useState } from "react";
import { toast } from "sonner";
import { DropZone } from "@/components/shared/DropZone";
import { Spinner } from "@/components/shared/Spinner";

interface ImportZoneProps {
  onImport: (file: File) => Promise<void>;
}

export function ImportZone({ onImport }: ImportZoneProps) {
  const [importing, setImporting] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".mjml")) {
      toast.error("Ce fichier n'est pas un template valide. Utilisez un fichier .mjml");
      return;
    }
    setImporting(true);
    try {
      await onImport(file);
    } finally {
      setImporting(false);
    }
  };

  if (importing) {
    return (
      <div className="border-2 border-dashed border-indigo-300 bg-indigo-50 rounded-xl p-8 flex items-center justify-center gap-3">
        <Spinner size="sm" />
        <span className="text-sm text-indigo-600">Import en cours...</span>
      </div>
    );
  }

  return <DropZone onFileDrop={handleFile} accept=".mjml" />;
}
