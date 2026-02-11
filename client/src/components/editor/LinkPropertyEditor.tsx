interface LinkPropertyEditorProps {
  href: string;
  onChange: (value: string) => void;
}

export function LinkPropertyEditor({ href, onChange }: LinkPropertyEditorProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        Lien (URL)
      </label>
      <input
        type="text"
        value={href}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  );
}
