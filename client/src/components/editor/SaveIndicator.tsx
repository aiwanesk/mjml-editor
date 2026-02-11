import { Check, Loader2, AlertCircle, Circle } from "lucide-react";
import { clsx } from "clsx";
import type { SaveStatus } from "@/hooks/useAutoSave";

interface SaveIndicatorProps {
  status: SaveStatus;
}

const statusConfig = {
  saved: { icon: Check, text: "Sauvegardé", color: "text-green-500" },
  saving: { icon: Loader2, text: "Sauvegarde...", color: "text-indigo-500" },
  unsaved: { icon: Circle, text: "Non sauvegardé", color: "text-amber-500" },
  error: { icon: AlertCircle, text: "Erreur de sauvegarde", color: "text-red-500" },
};

export function SaveIndicator({ status }: SaveIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={clsx("flex items-center gap-1 text-xs", config.color)}>
      <Icon className={clsx("h-3 w-3", status === "saving" && "animate-spin")} />
      <span>{config.text}</span>
    </div>
  );
}
