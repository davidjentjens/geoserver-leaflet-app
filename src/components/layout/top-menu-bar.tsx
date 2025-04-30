// src/components/layout/TopMenubar.tsx
import { Eye, EyeOff, Info, Layers, Settings } from "lucide-react";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useLayerContext } from "@/contexts/layer-context";
import { cn } from "@/lib/utils";

import { SidebarTrigger } from "../ui/sidebar";

interface TopMenubarProps {
  className?: string;
}

export function TopMenubar({ className }: TopMenubarProps) {
  const {
    availableLayers,
    selectedLayers,
    showLayers,
    toggleLayer,
    toggleLayerVisibility,
    selectAllLayers,
    clearAllLayers,
  } = useLayerContext();

  return (
    <Menubar
      className={cn(
        `rounded-none border-b border-none px-2 lg:px-4 z-50`,
        className,
      )}
    >
      <MenubarMenu>
        <SidebarTrigger />
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>
          <Layers className="mr-2 h-4 w-4" />
          Layers
        </MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem
            checked={showLayers}
            onCheckedChange={toggleLayerVisibility}
          >
            {showLayers ? (
              <span className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Show Layers
              </span>
            ) : (
              <span className="flex items-center">
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Layers
              </span>
            )}
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem onClick={selectAllLayers}>Select All</MenubarItem>
          <MenubarItem onClick={clearAllLayers}>Clear All</MenubarItem>
          <MenubarSeparator />

          {availableLayers.length > 10 ? (
            <MenubarSub>
              <MenubarSubTrigger>Available Layers</MenubarSubTrigger>
              <MenubarSubContent>
                {availableLayers.map((layer) => (
                  <MenubarCheckboxItem
                    key={layer.name}
                    checked={selectedLayers.includes(layer.name)}
                    onCheckedChange={() => toggleLayer(layer.name)}
                  >
                    {layer.name}
                  </MenubarCheckboxItem>
                ))}
              </MenubarSubContent>
            </MenubarSub>
          ) : (
            availableLayers.map((layer) => (
              <MenubarCheckboxItem
                key={layer.name}
                checked={selectedLayers.includes(layer.name)}
                onCheckedChange={() => toggleLayer(layer.name)}
              >
                {layer.name}
              </MenubarCheckboxItem>
            ))
          )}
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Base Map</MenubarItem>
          <MenubarItem>Projection</MenubarItem>
          <MenubarItem>Preferences</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>
          <Info className="mr-2 h-4 w-4" />
          Help
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>About</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
