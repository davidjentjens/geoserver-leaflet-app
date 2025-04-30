// src/components/map/map-component.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { useLayerContext } from "@/contexts/layer-context";
import { GEOSERVER_URL } from "@/lib/geoserver";

import { TopMenubar } from "./top-menu-bar";
import WMSLayer from "./wms-layer";

// Default map center coordinates
const DEFAULT_CENTER: [number, number] = [0, 0];
const DEFAULT_ZOOM = 2;

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const { selectedLayers, showLayers } = useLayerContext();

  // This prevents hydration errors with react-leaflet
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <TopMenubar className="-z-50" />
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "calc(100% - 36px)", width: "100%" }}
        className="z-10"
        zoomControl={false}
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
    </>
  );
}
