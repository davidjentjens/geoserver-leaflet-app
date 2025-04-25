// src/components/map/map-component.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, WMSTileLayer } from "react-leaflet";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Default map center coordinates (adjust as needed)
const DEFAULT_CENTER: [number, number] = [0, 0];
const DEFAULT_ZOOM = 2;

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [showGeoServer, setShowGeoServer] = useState(true);

  // This prevents hydration errors with react-leaflet
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Replace with your actual GeoServer URL and layer
  const geoServerUrl = "http://localhost:8080/geoserver/wms";
  const geoServerLayer = "radar:Fase8Norte";

  return (
    <Card className="w-full h-[600px]">
      <CardHeader>
        <CardTitle>GeoServer Map Integration</CardTitle>
        <div className="flex items-center space-x-2">
          <Switch
            id="geoserver-layer"
            checked={showGeoServer}
            onCheckedChange={setShowGeoServer}
          />
          <Label htmlFor="geoserver-layer">GeoServer Layer</Label>
        </div>
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
          {showGeoServer && (
            <WMSTileLayer
              url={geoServerUrl}
              layers={geoServerLayer}
              format="image/png"
              transparent={true}
            />
          )}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
