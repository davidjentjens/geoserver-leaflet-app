import { SidebarProvider } from "@/components/ui/sidebar";

import { AreasProvider } from "./areas-context";
import { LayerProvider } from "./layer-context";

export const UniversalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <LayerProvider>
      <AreasProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </AreasProvider>
    </LayerProvider>
  );
};
