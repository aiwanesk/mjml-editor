interface StylePropertyEditorProps {
  tagName: string;
  attributes: Record<string, string>;
  onUpdateAttribute: (key: string, value: string) => void;
}

interface PropertyField {
  key: string;
  label: string;
  type: "text" | "select";
  options?: string[];
}

const TAG_PROPERTIES: Record<string, PropertyField[]> = {
  "mj-text": [
    { key: "font-size", label: "Taille de police", type: "text" },
    { key: "font-weight", label: "Graisse", type: "select", options: ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { key: "align", label: "Alignement", type: "select", options: ["left", "center", "right"] },
    { key: "line-height", label: "Interligne", type: "text" },
    { key: "padding", label: "Padding", type: "text" },
  ],
  "mj-button": [
    { key: "font-size", label: "Taille de police", type: "text" },
    { key: "border-radius", label: "Arrondi", type: "text" },
    { key: "align", label: "Alignement", type: "select", options: ["left", "center", "right"] },
    { key: "padding", label: "Padding", type: "text" },
    { key: "inner-padding", label: "Padding interne", type: "text" },
  ],
  "mj-image": [
    { key: "align", label: "Alignement", type: "select", options: ["left", "center", "right"] },
    { key: "padding", label: "Padding", type: "text" },
    { key: "border-radius", label: "Arrondi", type: "text" },
  ],
  "mj-section": [
    { key: "padding", label: "Padding", type: "text" },
    { key: "border-radius", label: "Arrondi", type: "text" },
  ],
  "mj-column": [
    { key: "padding", label: "Padding", type: "text" },
    { key: "width", label: "Largeur", type: "text" },
  ],
  "mj-divider": [
    { key: "border-width", label: "Épaisseur", type: "text" },
    { key: "border-style", label: "Style", type: "select", options: ["solid", "dashed", "dotted"] },
    { key: "padding", label: "Padding", type: "text" },
    { key: "width", label: "Largeur", type: "text" },
  ],
  "mj-spacer": [
    { key: "height", label: "Hauteur", type: "text" },
  ],
};

export function StylePropertyEditor({
  tagName,
  attributes,
  onUpdateAttribute,
}: StylePropertyEditorProps) {
  const fields = TAG_PROPERTIES[tagName];
  if (!fields) return null;

  return (
    <div className="space-y-3 border-t border-gray-200 pt-4 mt-4">
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Style</h4>
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              value={attributes[field.key] || ""}
              onChange={(e) => onUpdateAttribute(field.key, e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="">—</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={attributes[field.key] || ""}
              onChange={(e) => onUpdateAttribute(field.key, e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          )}
        </div>
      ))}
    </div>
  );
}
