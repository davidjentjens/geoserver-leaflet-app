// src/app/page.tsx
"use client";
import dynamic from "next/dynamic";

import { MainLayout } from "@/components/layout/main-layout";
import { LayerProvider } from "@/contexts/layer-context";

// Dynamic import for the map component to prevent SSR issues
const MapComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-pulse text-lg">Loading Map...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <LayerProvider>
      <MainLayout>
        <div className="h-full w-full">
          <MapComponent />
        </div>
      </MainLayout>
    </LayerProvider>
  );
}
