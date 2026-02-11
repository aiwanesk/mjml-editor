import { type ReactNode, useState } from "react";
import { Settings2, LayoutGrid } from "lucide-react";

interface EditorLayoutProps {
  widgetPanel: ReactNode;
  preview: ReactNode;
  propertyPanel: ReactNode;
  toolbar: ReactNode;
}

type LeftTab = "properties" | "widgets";

export function EditorLayout({ widgetPanel, preview, propertyPanel, toolbar }: EditorLayoutProps) {
  const [activeTab, setActiveTab] = useState<LeftTab>("properties");

  return (
    <div className="flex flex-col h-[calc(100vh-49px)]">
      <div className="border-b border-gray-200 bg-white">{toolbar}</div>
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL — Editable fields + Widgets (tabbed) */}
        <aside className="w-[480px] border-r border-gray-200 bg-white flex flex-col shrink-0">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("properties")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "properties"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Settings2 className="h-4 w-4" />
              Propriétés
            </button>
            <button
              onClick={() => setActiveTab("widgets")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "widgets"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              data-tour="widgets"
            >
              <LayoutGrid className="h-4 w-4" />
              Widgets
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeTab === "properties" ? propertyPanel : widgetPanel}
          </div>
        </aside>

        {/* RIGHT PANEL — Live preview */}
        <div className="flex-1 overflow-hidden" data-tour="preview">
          {preview}
        </div>
      </div>
    </div>
  );
}
