// src/components/map/map-component.tsx
"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GEOSERVER_URL, getAvailableLayers } from "@/lib/geoserver";

import WMSLayer from "./wms-layer";

// Default map center coordinates
const DEFAULT_CENTER: [number, number] = [0, 0];
const DEFAULT_ZOOM = 2;

// Layer type interface
interface GeoServerLayer {
  name: string;
  href: string;
}

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [availableLayers, setAvailableLayers] = useState<GeoServerLayer[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [showLayers, setShowLayers] = useState(true);

  // This prevents hydration errors with react-leaflet
  useEffect(() => {
    setMounted(true);

    // Fetch available layers when component mounts
    async function fetchLayers() {
      try {
        const layers = await getAvailableLayers();
        setAvailableLayers(layers);
        if (layers.length > 0) {
          // Set the first layer as selected by default
          setSelectedLayers([layers[0].name]);
        }
      } catch (error) {
        console.error("Failed to fetch layers:", error);
      }
    }

    fetchLayers();
  }, []);

  if (!mounted) return null;

  // Toggle layer selection
  const toggleLayer = (layerName: string) => {
    setSelectedLayers((prev) => {
      if (prev.includes(layerName)) {
        return prev.filter((name) => name !== layerName);
      } else {
        return [...prev, layerName];
      }
    });
  };

  // Get selected layer count text
  const getSelectedLayersText = () => {
    if (selectedLayers.length === 0) return "No layers selected";
    if (selectedLayers.length === 1) return selectedLayers[0];
    return `${selectedLayers.length} layers selected`;
  };

  return (
    <Card className="w-full h-[600px]">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="layer-visibility"
              checked={showLayers}
              onCheckedChange={setShowLayers}
            />
            <Label htmlFor="layer-visibility" className="font-medium">
              Show GeoServer Layers
            </Label>
          </div>

          {availableLayers.length > 0 ? (
            <div className="flex-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal relative z-30 border-primary/20 hover:border-primary/60"
                  >
                    <span className="truncate max-w-[280px]">
                      {getSelectedLayersText()}
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[300px] max-h-[400px] overflow-auto z-50"
                  sideOffset={4}
                  align="start"
                >
                  <DropdownMenuLabel className="font-medium">
                    Available Layers
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableLayers.map((layer) => (
                    <DropdownMenuCheckboxItem
                      key={layer.name}
                      checked={selectedLayers.includes(layer.name)}
                      onCheckedChange={() => toggleLayer(layer.name)}
                      className="cursor-pointer py-2"
                    >
                      <span className="truncate">{layer.name}</span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedLayers.length === 0
                  ? "Select at least one layer to display"
                  : `Displaying ${selectedLayers.length} layer${selectedLayers.length > 1 ? "s" : ""}`}
              </p>
            </div>
          ) : (
            <div className="flex-1 animate-pulse bg-secondary h-9 rounded-md"></div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 h-full relative">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          className="z-10" // Ensure map has a lower z-index
        >
          {/* Base map layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* GeoServer WMS layers */}
          {showLayers &&
            selectedLayers.map((layerName, index) => (
              <WMSLayer
                key={layerName}
                url={`${GEOSERVER_URL}/wms`}
                layerName={layerName}
                format="image/png"
                transparent={true}
                zIndex={20 + index} // Increment zIndex for each layer
                opacity={0.8} // Slightly transparent to see overlapping layers
              />
            ))}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
