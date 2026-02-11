import type { ReactNode } from "react";
import { Header } from "./Header";

interface AppShellProps {
  children: ReactNode;
  showHelp?: boolean;
  onHelpClick?: () => void;
  headerRight?: ReactNode;
}

export function AppShell({ children, showHelp, onHelpClick, headerRight }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showHelp={showHelp} onHelpClick={onHelpClick} rightContent={headerRight} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
