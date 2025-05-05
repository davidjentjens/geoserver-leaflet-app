/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/map/area-editor.tsx
"use client";

// Load Leaflet Draw CSS
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L, { Polygon } from "leaflet";
import { useEffect, useRef } from "react";
import { FeatureGroup, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import { useAreasContext } from "@/contexts/areas-context";

import { getSelectionColor } from "./utils";

export default function AreaEditor() {
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const map = useMap(); // Get access to the map instance

  const {
    areas,
    showAreas,
    selectedArea,
    isEditing,
    enableEditInterface,
    setIsModalOpen,
    setTemporaryGeometry,
    selectArea,
    updateArea,
  } = useAreasContext();

  // Display all areas on the map
  useEffect(() => {
    if (!featureGroupRef.current) return;

    if (!showAreas) {
      // If areas are not shown, clear the feature group and return
      featureGroupRef.current.clearLayers();
      return;
    }

    // Clear all layers first
    featureGroupRef.current.clearLayers();

    // Add all areas to the feature group
    areas.forEach((area) => {
      const layer = L.geoJSON(area.geometry);

      // Add each layer from the GeoJSON
      layer.eachLayer((l) => {
        if (l instanceof L.Path) {
          // Get the color based on the selection state
          // and whether the edit interface is enabled
          const color = getSelectionColor({
            area,
            selectedArea,
            enableEditInterface,
          });

          // Set style
          l.setStyle({
            color,
            weight: selectedArea?.id === area.id ? 4 : 3,
            opacity: 0.7,
            fillOpacity: 0.3,
          });

          // Add a popup
          l.bindTooltip(area.name);

          // Add click handler
          l.on("click", (e) => {
            // Stop propagation to prevent the map click from firing
            L.DomEvent.stopPropagation(e);
            selectArea(area.id);
          });

          // Add the layer to the feature group
          featureGroupRef.current?.addLayer(l);
        }
      });
    });
  }, [areas, showAreas, selectedArea, selectArea, enableEditInterface]);

  // When entering edit mode for an existing area
  useEffect(() => {
    if (!featureGroupRef.current || !selectedArea || !isEditing) return;

    // Enable editing for the selected area
    featureGroupRef.current.eachLayer((layer) => {
      if (layer instanceof L.Path) {
        // Check if this layer belongs to the selected area
        const layerJson = (layer as any).toGeoJSON();
        const layerId = layerJson.properties?.id;

        if (layerId === selectedArea.id) {
          // Enable editing for this layer
          if ((layer as any).editing) {
            // @ts-expect-error: Leaflet types don't include enable() on editing
            layer.editing.enable();
          }
        }
      }
    });
  }, [isEditing, selectedArea]);

  // Add click handler to the map to deselect areas
  useEffect(() => {
    if (!map) return;

    const handleMapClick = () => {
      // Only deselect if we have a selected area
      if (selectedArea) {
        selectArea(undefined);
      }
    };

    // Add the event listener
    map.on("click", handleMapClick);

    // Clean up
    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, selectArea, selectedArea]);

  // Handle drawing start
  const handleDrawStart = () => {
    // De-select any selected area
    if (selectedArea) {
      //selectArea(undefined);
    }
  };

  // Handle drawing creation
  const handleCreated = (e: L.DrawEvents.Created) => {
    const { layer } = e;

    // Convert the drawn layer to GeoJSON
    const geoJson = layer.toGeoJSON();

    // Set temporary geometry
    setTemporaryGeometry(geoJson);

    // Open the modal to collect area details
    setIsModalOpen(true);

    // Remove the layer since we're storing it in state now
    featureGroupRef.current?.removeLayer(layer);
  };

  // Handle editing of existing shapes
  const handleEdited = (e: L.DrawEvents.Edited) => {
    if (!selectedArea) return;

    const layers = e.layers;
    layers.eachLayer((layer) => {
      console.log("Edited layer:", layer);

      // Convert the edited layer to GeoJSON
      const geoJson = (layer as Polygon).toGeoJSON();

      console.log("Edited GeoJSON:", geoJson);

      // Update the area with the new geometry
      updateArea(selectedArea.id, {
        geometry: geoJson,
      });
    });

    // Exit edit mode
    setIsModalOpen(false);
  };

  return (
    <FeatureGroup ref={featureGroupRef}>
      <EditControl
        position="topright"
        onDrawStart={handleDrawStart}
        onCreated={handleCreated}
        onEdited={handleEdited}
        draw={{
          rectangle: false,
          polyline: false,
          polygon: enableEditInterface,
          circle: false,
          marker: false,
          circlemarker: false,
        }}
        edit={{
          edit: isEditing && enableEditInterface ? {} : false,
          remove: false, // We handle deletion via the dialog
        }}
      />
    </FeatureGroup>
  );
}
