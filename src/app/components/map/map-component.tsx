// src/components/map/map-component.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
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
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [showLayer, setShowLayer] = useState(true);

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
          setSelectedLayer(layers[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch layers:", error);
      }
    }

    fetchLayers();
  }, []);

  if (!mounted) return null;

  // Get layer name parts (workspace:layername)
  const getLayerParts = (fullName: string) => {
    const parts = fullName.split(":");
    return {
      workspace: parts.length > 1 ? parts[0] : "radar", // fallback to radar if format is unexpected
      layer: parts.length > 1 ? parts[1] : fullName,
    };
  };

  return (
    <Card className="w-full h-[600px]">
      <CardHeader>
        <CardTitle>GeoServer Map Integration</CardTitle>
        <div className="flex items-center space-x-2 mb-2">
          <Switch
            id="layer-visibility"
            checked={showLayer}
            onCheckedChange={setShowLayer}
          />
          <Label htmlFor="layer-visibility">Show GeoServer Layer</Label>
        </div>

        {availableLayers.length > 0 ? (
          <div className="mt-4">
            <Label>Select Layer:</Label>
            <select
              className="w-full p-2 border rounded mt-1"
              value={selectedLayer || ""}
              onChange={(e) => setSelectedLayer(e.target.value)}
            >
              {availableLayers.map((layer) => (
                <option key={layer.name} value={layer.name}>
                  {layer.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>Loading layers...</div>
        )}
      </CardHeader>
      <CardContent className="p-0 h-full">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Base map layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* GeoServer WMS layer */}
          {showLayer && selectedLayer && (
            <WMSLayer
              url={`${GEOSERVER_URL}/wms`}
              layerName={selectedLayer}
              format="image/png"
              transparent={true}
              zIndex={20}
            />
          )}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
