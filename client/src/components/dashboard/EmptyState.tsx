import { FileText } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <FileText className="h-16 w-16 mb-4 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-700 mb-1">
        Aucun template
      </h3>
      <p className="text-sm">
        Importez un fichier MJML pour commencer
      </p>
    </div>
  );
}
