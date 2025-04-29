// src/components/layout/LayersPanel.tsx
import { CheckCircle, Eye, EyeOff, Globe, Layers, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useLayerContext } from "@/contexts/layer-context";

import { Sidebar, SidebarHeader } from "../ui/sidebar";

export function LayersPanel() {
  const {
    availableLayers,
    selectedLayers,
    showLayers,
    isLoading,
    toggleLayer,
    toggleLayerVisibility,
    selectAllLayers,
    clearAllLayers,
  } = useLayerContext();

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
          GeoServer Layers
        </h2>
        <div className="space-y-1">
          <div className="flex items-center px-2 py-2 rounded-md">
            <Switch
              id="layer-visibility"
              checked={showLayers}
              onCheckedChange={toggleLayerVisibility}
            />
            <Label htmlFor="layer-visibility" className="ml-2">
              {showLayers ? (
                <span className="flex items-center gap-2">
                  <Eye size={16} /> Show Layers
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <EyeOff size={16} /> Hide Layers
                </span>
              )}
            </Label>
          </div>
        </div>
      </SidebarHeader>
      <Separator />
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="px-2 text-lg font-semibold tracking-tight">
            <Layers className="inline-block mr-2" size={18} /> Available Layers
          </h2>
          <div className="space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllLayers}
              title="Select All Layers"
            >
              <CheckCircle size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllLayers}
              title="Clear All Layers"
            >
              <XCircle size={16} />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[500px] px-1">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-12 bg-secondary rounded-md"
                />
              ))}
            </div>
          ) : availableLayers.length > 0 ? (
            <div className="space-y-1">
              {availableLayers.map((layer) => (
                <Button
                  key={layer.name}
                  variant={
                    selectedLayers.includes(layer.name) ? "default" : "outline"
                  }
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => toggleLayer(layer.name)}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  <span className="truncate">{layer.name}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No layers found
            </div>
          )}
        </ScrollArea>
      </div>
    </Sidebar>
  );
}
