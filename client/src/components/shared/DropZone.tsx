import { useCallback, useState, type DragEvent, type ReactNode } from "react";
import { clsx } from "clsx";
import { Upload } from "lucide-react";

interface DropZoneProps {
  onFileDrop: (file: File) => void;
  accept?: string;
  children?: ReactNode;
  className?: string;
}

export function DropZone({ onFileDrop, accept = ".mjml", children, className }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileDrop(file);
    },
    [onFileDrop]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={clsx(
        "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
        isDragOver
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-300 hover:border-gray-400",
        className
      )}
    >
      {children || (
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <Upload className="h-8 w-8" />
          <p className="text-sm">
            Glissez un fichier {accept} ici ou{" "}
            <label className="text-indigo-500 hover:text-indigo-600 cursor-pointer font-medium">
              parcourir
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileDrop(file);
                  e.target.value = "";
                }}
              />
            </label>
          </p>
        </div>
      )}
    </div>
  );
}
