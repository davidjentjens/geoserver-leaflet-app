// src/components/map/area-editor.tsx
"use client";

// Load Leaflet Draw CSS
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L from "leaflet";
import { useEffect, useRef } from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import { useAreasContext } from "@/contexts/areas-context";

export default function AreaEditor() {
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const {
    areas,
    selectedArea,
    isEditing,
    setIsModalOpen,
    setTemporaryGeometry,
    selectArea,
    updateArea,
    getAreasAsGeoJSON,
  } = useAreasContext();

  // Display all areas on the map
  useEffect(() => {
    if (!featureGroupRef.current) return;

    // Clear all layers first
    featureGroupRef.current.clearLayers();

    // Add all areas to the feature group
    areas.forEach((area) => {
      const layer = L.geoJSON(area.geometry);

      // Add each layer from the GeoJSON
      layer.eachLayer((l) => {
        if (l instanceof L.Path) {
          // Set style
          l.setStyle({
            color: selectedArea?.id === area.id ? "#ff4081" : "#3388ff",
            weight: selectedArea?.id === area.id ? 4 : 3,
            opacity: 0.7,
            fillOpacity: 0.3,
          });

          // Add a popup
          l.bindTooltip(area.name);

          // Add click handler
          l.on("click", () => {
            selectArea(area.id);
          });

          // Add the layer to the feature group
          featureGroupRef.current?.addLayer(l);
        }
      });
    });
  }, [areas, selectedArea, selectArea]);

  // When entering edit mode for an existing area
  useEffect(() => {
    if (!featureGroupRef.current || !selectedArea || !isEditing) return;

    // Enable editing for the selected area
    featureGroupRef.current.eachLayer((layer) => {
      if (layer instanceof L.Path) {
        // Check if this layer belongs to the selected area
        const layerJson = layer.toGeoJSON();
        const layerId = layerJson.properties?.id;

        if (layerId === selectedArea.id) {
          // Enable editing for this layer
          if (layer.editing) {
            // @ts-expect-error: Leaflet types don't include enable() on editing
            layer.editing.enable();
          }
        }
      }
    });
  }, [isEditing, selectedArea]);

  // Handle drawing creation
  const handleCreated = (e: any) => {
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
  const handleEdited = (e: any) => {
    if (!selectedArea) return;

    const layers = e.layers;
    layers.eachLayer((layer: L.Layer) => {
      // Convert the edited layer to GeoJSON
      const geoJson = layer.toGeoJSON();

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
        onCreated={handleCreated}
        onEdited={handleEdited}
        draw={{
          rectangle: false,
          polyline: false,
          polygon: true,
          circle: false,
          marker: false,
          circlemarker: false,
        }}
        edit={{
          edit: isEditing,
          remove: false, // We handle deletion via the dialog
        }}
      />
    </FeatureGroup>
  );
}
