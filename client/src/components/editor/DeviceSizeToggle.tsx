import { Monitor, Tablet, Smartphone } from "lucide-react";
import { clsx } from "clsx";

const SIZES = [
  { label: "Desktop", icon: Monitor, width: 600 },
  { label: "Tablet", icon: Tablet, width: 480 },
  { label: "Mobile", icon: Smartphone, width: 320 },
];

interface DeviceSizeToggleProps {
  value: number;
  onChange: (width: number) => void;
}

export function DeviceSizeToggle({ value, onChange }: DeviceSizeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {SIZES.map(({ label, icon: Icon, width }) => (
        <button
          key={width}
          onClick={() => onChange(width)}
          className={clsx(
            "p-1.5 rounded-md transition-colors",
            value === width
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
