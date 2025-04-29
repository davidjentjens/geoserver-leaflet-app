// src/components/layout/MainLayout.tsx
import { ReactNode } from "react";

import { SidebarProvider } from "../ui/sidebar";
import { LayersPanel } from "./layers-panel";
import { TopMenubar } from "./top-menu-bar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <SidebarProvider>
        <LayersPanel />
        <main className="flex-1 overflow-hidden">
          <TopMenubar />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
