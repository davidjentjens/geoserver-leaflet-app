import { SidebarProvider } from "@/components/ui/sidebar";

import { LayerProvider } from "./layer-context";

export const UniversalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <LayerProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </LayerProvider>
  );
};
