// src/components/layout/MainLayout.tsx
import { ReactNode } from "react";

import { SidebarProvider } from "../ui/sidebar";
import { NavigationPanel } from "./navigation-panel";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <SidebarProvider>
        <NavigationPanel />
        <main className="flex-1 overflow-hidden">{children}</main>
      </SidebarProvider>
    </div>
  );
}
