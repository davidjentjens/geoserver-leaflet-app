// src/components/map/index.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import { useAreasContext } from "@/contexts/areas-context";
import { useLayerContext } from "@/contexts/layer-context";
import { GEOSERVER_URL } from "@/lib/geoserver";

import AreaEditor from "./area-editor";
import { AreaFormDialog } from "./area-form-dialog";
import { AreasPanel } from "./areas-panel";
import { TopMenubar } from "./top-menu-bar";
import WMSLayer from "./wms-layer";

// Default map center coordinates
const DEFAULT_CENTER: [number, number] = [-9.545, -77.065];
const DEFAULT_ZOOM = 15.49;

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const { selectedLayers, showLayers } = useLayerContext();
  const { enableEditInterface, selectedArea, selectArea } = useAreasContext();

  // This prevents hydration errors with react-leaflet
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <TopMenubar className="z-50" />
      <div className="flex flex-1 h-[calc(100%-36px)]">
        {/* Areas Panel Sidebar */}
        {enableEditInterface && (
          <div className="w-80 h-full border-r">
            <AreasPanel />
          </div>
        )}

        {/* Main Map Area */}
        <div className="flex-1 relative">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height: "100%", width: "100%" }}
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

            {/* Area of Interest Editor */}
            <AreaEditor />

            {/* Map Controls */}
            <ZoomControl position="bottomright" />
          </MapContainer>

          {/* Selected Area Highlight */}
          {selectedArea && (
            <div className="absolute top-0 left-0 z-20 w-full h-full pointer-events-none">
              <button
                className={`m-2 p-3 flex gap-1.5 rounded-4xl shadow text-white ${enableEditInterface ? "bg-chart-1" : "bg-chart-5"}`}
                onClick={() => selectArea(undefined)}
              >
                Selected Area: <b>{selectedArea.name}</b>
              </button>
            </div>
          )}

          {/* Area Form Dialog for creating and editing areas */}
          <AreaFormDialog />
        </div>
      </div>
    </>
  );
}
