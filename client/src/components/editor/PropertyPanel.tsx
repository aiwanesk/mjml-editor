import { useMemo, useState } from "react";
import {
  FileText,
  Type,
  MousePointer,
  Image,
  Minus,
  MoveVertical,
  Share2,
  Plus,
  Trash2,
  LayoutTemplate,
  Columns2,
  Columns3,
} from "lucide-react";
import type { MjmlNode } from "@/types/mjml";
import { getBodyNode } from "@/lib/mjml-utils";
import { widgetDefaults } from "@/lib/widget-defaults";

interface PropertyPanelProps {
  ast: MjmlNode;
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onUpdateContent: (nodeId: string, content: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onInsertWidget: (index: number, widgetId: string) => void;
}

const TAG_LABELS: Record<string, string> = {
  "mj-text": "Texte",
  "mj-button": "Bouton",
  "mj-image": "Image",
  "mj-divider": "Séparateur",
  "mj-spacer": "Espacement",
  "mj-social": "Réseaux sociaux",
};

const TAG_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "mj-text": Type,
  "mj-button": MousePointer,
  "mj-image": Image,
  "mj-divider": Minus,
  "mj-spacer": MoveVertical,
  "mj-social": Share2,
};

const WIDGET_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  text: Type,
  image: Image,
  button: MousePointer,
  divider: Minus,
  spacer: MoveVertical,
  social: Share2,
  section: LayoutTemplate,
  "2-columns": Columns2,
  "3-columns": Columns3,
};

const TEXT_TAGS = ["mj-text", "mj-button"];

function getSectionSummary(section: MjmlNode): string[] {
  const tags: string[] = [];
  if (section.children) {
    for (const col of section.children) {
      if (col.children) {
        for (const child of col.children) {
          tags.push(TAG_LABELS[child.tagName] || child.tagName);
        }
      }
    }
  }
  return tags;
}

function getColumnCount(section: MjmlNode): number {
  return section.children?.filter((c) => c.tagName === "mj-column").length || 0;
}

function getTextFields(section: MjmlNode): { nodeId: string; tagName: string; node: MjmlNode }[] {
  const fields: { nodeId: string; tagName: string; node: MjmlNode }[] = [];
  function walk(node: MjmlNode) {
    if (node["data-node-id"] && TEXT_TAGS.includes(node.tagName)) {
      fields.push({ nodeId: node["data-node-id"], tagName: node.tagName, node });
    }
    if (node.children) {
      for (const child of node.children) walk(child);
    }
  }
  walk(section);
  return fields;
}

export function PropertyPanel({
  ast,
  selectedNodeId,
  onSelectNode,
  onUpdateContent,
  onDeleteNode,
  onInsertWidget,
}: PropertyPanelProps) {
  const body = useMemo(() => getBodyNode(ast), [ast]);
  const sections = body?.children || [];

  if (sections.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-gray-400">
        <FileText className="h-8 w-8 mb-3" />
        <p className="text-sm text-center">
          Ajoutez des widgets au template pour les modifier ici
        </p>
        <div className="mt-4">
          <InsertButton index={0} onInsertWidget={onInsertWidget} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-0">
      <InsertButton index={0} onInsertWidget={onInsertWidget} />
      {sections.map((section, index) => (
        <div key={section["data-node-id"] || index}>
          <SectionCard
            section={section}
            index={index}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            onUpdateContent={onUpdateContent}
            onDeleteNode={onDeleteNode}
          />
          <InsertButton index={index + 1} onInsertWidget={onInsertWidget} />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface SectionCardProps {
  section: MjmlNode;
  index: number;
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onUpdateContent: (nodeId: string, content: string) => void;
  onDeleteNode: (nodeId: string) => void;
}

function SectionCard({ section, index, selectedNodeId, onSelectNode, onUpdateContent, onDeleteNode }: SectionCardProps) {
  const nodeId = section["data-node-id"];
  const textFields = getTextFields(section);
  const summary = getSectionSummary(section);
  const cols = getColumnCount(section);
  const isSelected = selectedNodeId === nodeId;

  const title = cols > 1 ? `Section ${index + 1} (${cols} col.)` : `Section ${index + 1}`;
  const subtitle = summary.length > 0 ? summary.join(", ") : "Vide";

  return (
    <div
      className={`rounded-lg border transition-colors ${
        isSelected
          ? "border-indigo-300 bg-indigo-50/60 ring-1 ring-indigo-200"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {/* Section header */}
      <div className="flex items-center justify-between px-3 py-2">
        <button
          onClick={() => onSelectNode(nodeId || null)}
          className="flex items-center gap-2 text-left truncate flex-1 min-w-0"
        >
          <LayoutTemplate className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          <div className="min-w-0">
            <div className="text-xs font-medium text-gray-700 truncate">{title}</div>
            <div className="text-[11px] text-gray-400 truncate">{subtitle}</div>
          </div>
        </button>
        {nodeId && (
          <button
            onClick={() => onDeleteNode(nodeId)}
            className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0 ml-2"
            title="Supprimer cette section"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Editable text fields */}
      {textFields.length > 0 && (
        <div className="px-3 pb-3 space-y-2 border-t border-gray-100 pt-2">
          {textFields.map((field) => {
            const fieldLabel = TAG_LABELS[field.tagName] || field.tagName;
            const Icon = TAG_ICONS[field.tagName] || Type;
            const fieldSelected = selectedNodeId === field.nodeId;

            return (
              <div key={field.nodeId}>
                <label className="flex items-center gap-1.5 mb-1 cursor-pointer">
                  <Icon className={`h-3 w-3 shrink-0 ${fieldSelected ? "text-indigo-500" : "text-gray-400"}`} />
                  <span className="text-xs text-gray-500">{fieldLabel}</span>
                </label>
                <textarea
                  value={field.node.content || ""}
                  onChange={(e) => onUpdateContent(field.nodeId, e.target.value)}
                  onFocus={() => onSelectNode(field.nodeId)}
                  rows={field.tagName === "mj-button" ? 1 : 2}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md
                             focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                             bg-white resize-y placeholder:text-gray-300"
                  placeholder="Saisir le texte…"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface InsertButtonProps {
  index: number;
  onInsertWidget: (index: number, widgetId: string) => void;
}

function InsertButton({ index, onInsertWidget }: InsertButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center py-1.5 relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-1 text-xs text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full border border-dashed border-gray-300 hover:border-indigo-400 transition-colors"
      >
        <Plus className="h-3 w-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-52 max-h-72 overflow-y-auto">
            {widgetDefaults.map((w) => {
              const Icon = WIDGET_ICONS[w.id] || LayoutTemplate;
              return (
                <button
                  key={w.id}
                  onClick={() => {
                    onInsertWidget(index, w.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {w.name}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
