interface TextPropertyEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextPropertyEditor({ value, onChange }: TextPropertyEditorProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        Contenu
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
      />
    </div>
  );
}
