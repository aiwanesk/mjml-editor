import type { Template } from "@/types/template";
import { TemplateCard } from "./TemplateCard";
import { EmptyState } from "./EmptyState";

interface TemplateGridProps {
  templates: Template[];
  onDelete: (id: string) => void;
}

export function TemplateGrid({ templates, onDelete }: TemplateGridProps) {
  if (templates.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
