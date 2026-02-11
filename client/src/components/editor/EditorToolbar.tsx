import { ArrowLeft, Undo2, Redo2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/shared/Button";
import { SaveIndicator } from "./SaveIndicator";
import { ExportMenu } from "./ExportMenu";
import type { SaveStatus } from "@/hooks/useAutoSave";

interface EditorToolbarProps {
  templateName: string;
  templateId: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  saveStatus: SaveStatus;
}

export function EditorToolbar({
  templateName,
  templateId,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  saveStatus,
}: EditorToolbarProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Retour au dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="font-medium text-gray-900">{templateName}</span>
        <SaveIndicator status={saveStatus} />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Annuler (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Rétablir (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <Button variant="secondary" size="sm" onClick={onSave}>
          <Save className="h-4 w-4" />
          Sauvegarder
        </Button>
        <ExportMenu templateId={templateId} templateName={templateName} />
      </div>
    </div>
  );
}
