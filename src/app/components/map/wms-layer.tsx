// src/components/map/wms-layer.tsx
import L from "leaflet";
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

interface WMSLayerProps {
  url: string;
  layerName: string;
  format?: string;
  transparent?: boolean;
  opacity?: number;
  zIndex?: number;
  // You can add more WMS parameters as needed
  additionalParams?: Record<string, string | boolean | number>;
}

/**
 * A wrapper component for WMS layers that properly handles updates
 * when props change.
 */
export default function WMSLayer({
  url,
  layerName,
  format = "image/png",
  transparent = true,
  opacity = 1.0,
  zIndex = 10,
  additionalParams = {},
}: WMSLayerProps) {
  // Get access to the Leaflet map instance
  const map = useMap();
  // Ref to track the current layer instance
  const layerRef = useRef<L.TileLayer.WMS | null>(null);

  useEffect(() => {
    // Skip if no layer name is provided
    if (!layerName) {
      return;
    }

    // Remove previous layer if it exists
    if (layerRef.current) {
      layerRef.current.remove();
    }

    // Create a new layer with updated props
    const wmsParams = {
      layers: layerName,
      format: format,
      transparent: transparent,
      ...additionalParams,
    };

    const newLayer = L.tileLayer.wms(url, wmsParams);

    // Set additional properties
    newLayer.setOpacity(opacity);
    newLayer.setZIndex(zIndex);

    // Add to map and store reference
    newLayer.addTo(map);
    layerRef.current = newLayer;

    // Cleanup function to remove layer when component unmounts or dependencies change
    return () => {
      if (layerRef.current) {
        layerRef.current.remove();
        layerRef.current = null;
      }
    };
  }, [
    map,
    url,
    layerName,
    format,
    transparent,
    opacity,
    zIndex,
    additionalParams,
  ]);

  // This component doesn't render anything visible
  return null;
}
