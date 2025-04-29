// src/components/layout/MainLayout.tsx
import { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";

import { LayersPanel } from "./layers-panel";
import { TopMenubar } from "./top-menu-bar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <TopMenubar />
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r">
          <LayersPanel />
        </aside>
        <Separator orientation="vertical" />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
