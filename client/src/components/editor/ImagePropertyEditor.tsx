import { useState } from "react";
import { Upload } from "lucide-react";
import { uploadApi } from "@/services/uploadApi";
import { toast } from "sonner";

interface ImagePropertyEditorProps {
  src: string;
  alt: string;
  width: string;
  onChangeSrc: (value: string) => void;
  onChangeAlt: (value: string) => void;
  onChangeWidth: (value: string) => void;
}

export function ImagePropertyEditor({
  src,
  alt,
  width,
  onChangeSrc,
  onChangeAlt,
  onChangeWidth,
}: ImagePropertyEditorProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadApi.uploadImage(file);
      onChangeSrc(result.url);
      toast.success("Image uploadée");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          URL de l'image
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={src}
            onChange={(e) => onChangeSrc(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <label className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "..." : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Texte alternatif
        </label>
        <input
          type="text"
          value={alt}
          onChange={(e) => onChangeAlt(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Largeur
        </label>
        <input
          type="text"
          value={width}
          onChange={(e) => onChangeWidth(e.target.value)}
          placeholder="600px"
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
