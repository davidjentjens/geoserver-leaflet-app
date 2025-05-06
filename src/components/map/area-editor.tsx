/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/map/area-editor.tsx
"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L from "leaflet";
import { useEffect, useRef } from "react";
import { FeatureGroup, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import { useAreasContext } from "@/contexts/areas-context";

import { getSelectionColor } from "./utils";

export default function AreaEditor() {
  // Reference to the feature group containing all non-selected areas
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  // New reference to feature group for the currently selected area
  const editableFeatureGroupRef = useRef<L.FeatureGroup>(null);

  const map = useMap();

  const {
    areas,
    showAreas,
    selectedArea,
    enableEditInterface,
    setIsModalOpen,
    selectArea,
    updateArea,
  } = useAreasContext();

  // Display all non-selected areas on the map
  useEffect(() => {
    if (!featureGroupRef.current) return;

    // Clear all non-selected layers
    featureGroupRef.current.clearLayers();

    // If areas shouldn't be shown, stop here
    if (!showAreas) return;

    // Add non-selected areas to the main feature group
    areas.forEach((area) => {
      // Skip the selected area - it will be added to the editable feature group
      if (selectedArea && area.id === selectedArea.id) return;

      const layerList = L.geoJSON(area.geometry);

      layerList.eachLayer((l) => {
        if (l instanceof L.Path) {
          const color = getSelectionColor({
            area,
            selectedArea,
            enableEditInterface,
          });

          l.setStyle({
            color,
            weight: 3,
            opacity: 0.7,
            fillOpacity: 0.3,
          });

          l.bindTooltip(area.name);

          l.on("click", (e) => {
            L.DomEvent.stopPropagation(e);
            selectArea(area.id);
          });

          featureGroupRef.current?.addLayer(l);
        }
      });
    });
  }, [areas, showAreas, selectedArea, selectArea, enableEditInterface]);

  // Handle the selected area in its own feature group
  useEffect(() => {
    if (!editableFeatureGroupRef.current) return;

    // Clear the editable feature group
    editableFeatureGroupRef.current.clearLayers();

    // If there's no selected area or areas shouldn't be shown, stop here
    if (!selectedArea || !showAreas) return;

    // Find the selected area
    const area = areas.find((a) => a.id === selectedArea.id);
    if (!area) return;

    // Add the selected area to the editable feature group
    const layer = L.geoJSON(area.geometry);

    layer.eachLayer((l) => {
      if (l instanceof L.Path) {
        const color = getSelectionColor({
          area,
          selectedArea,
          enableEditInterface,
        });

        l.setStyle({
          color,
          weight: 4,
          opacity: 0.7,
          fillOpacity: 0.3,
        });

        l.bindTooltip(area.name);

        l.on("click", (e) => {
          L.DomEvent.stopPropagation(e);
        });

        // Store the area ID in the layer properties
        if (l instanceof L.Path) {
          (l as L.Path & { feature: any }).feature = {
            type: "Feature",
            properties: { id: area.id },
            geometry: null, // This will be filled by toGeoJSON()
          };
        }

        editableFeatureGroupRef.current?.addLayer(l);
      }
    });
  }, [areas, showAreas, selectedArea, enableEditInterface]);

  // Add click handler to the map to deselect areas
  useEffect(() => {
    if (!map) return;

    const handleMapClick = () => {
      if (selectedArea) {
        selectArea(undefined);
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, selectArea, selectedArea]);

  // Handle drawing creation
  const handleCreated = (e: L.DrawEvents.Created) => {
    const { layer } = e;
    setIsModalOpen(true);
    editableFeatureGroupRef.current?.removeLayer(layer);
  };

  // Handle editing of existing shapes
  const handleEdited = (e: L.DrawEvents.Edited) => {
    if (!selectedArea) return;

    const layers = e.layers;
    layers.eachLayer((layer: any) => {
      // If layer does not match the selected area, skip it
      if (layer.feature?.properties?.id !== selectedArea.id) return;

      const geoJson = layer.toGeoJSON();
      updateArea(selectedArea.id, {
        geometry: geoJson,
      });
    });

    setIsModalOpen(false);
    selectArea(undefined);
  };

  return (
    <>
      {/* Feature group for all non-selected areas */}
      <FeatureGroup ref={featureGroupRef} />

      {/* Feature group for the currently selected/editable area */}
      <FeatureGroup ref={editableFeatureGroupRef}>
        {enableEditInterface && (
          <EditControl
            position="topright"
            onCreated={handleCreated}
            onEdited={handleEdited}
            draw={{
              rectangle: false,
              polyline: false,
              polygon: enableEditInterface && selectedArea === undefined,
              circle: false,
              marker: false,
              circlemarker: false,
            }}
            edit={{
              edit: true as never, // Always enabled for this feature group
              remove: false, // We handle deletion via the dialog
            }}
          />
        )}
      </FeatureGroup>
    </>
  );
}
