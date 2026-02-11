import { Link } from "react-router-dom";
import { Mail, HelpCircle } from "lucide-react";

interface HeaderProps {
  showHelp?: boolean;
  onHelpClick?: () => void;
  rightContent?: React.ReactNode;
}

export function Header({ showHelp, onHelpClick, rightContent }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-indigo-500 text-white rounded-lg p-1.5">
            <Mail className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-gray-900">MJML Editor</span>
        </Link>
        <div className="flex items-center gap-3">
          {rightContent}
          {showHelp && (
            <button
              onClick={onHelpClick}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Aide"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
