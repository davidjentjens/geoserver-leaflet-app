// src/contexts/LayerContext.tsx
"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { getAvailableLayers } from "@/lib/geoserver";

// Layer type interface
export interface GeoServerLayer {
  name: string;
  href: string;
}

interface LayerContextType {
  availableLayers: GeoServerLayer[];
  selectedLayers: string[];
  showLayers: boolean;
  isLoading: boolean;
  toggleLayer: (layerName: string) => void;
  toggleLayerVisibility: () => void;
  selectAllLayers: () => void;
  clearAllLayers: () => void;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export function LayerProvider({ children }: { children: ReactNode }) {
  const [availableLayers, setAvailableLayers] = useState<GeoServerLayer[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [showLayers, setShowLayers] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available layers when component mounts
  useEffect(() => {
    async function fetchLayers() {
      try {
        setIsLoading(true);
        const layers = await getAvailableLayers();
        setAvailableLayers(layers);
        if (layers.length > 0) {
          // Set the first layer as selected by default
          setSelectedLayers([layers[0].name]);
        }
      } catch (error) {
        console.error("Failed to fetch layers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLayers();
  }, []);

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

  // Toggle layer visibility
  const toggleLayerVisibility = () => {
    setShowLayers((prev) => !prev);
  };

  // Select all layers
  const selectAllLayers = () => {
    setSelectedLayers(availableLayers.map((layer) => layer.name));
  };

  // Clear all layers
  const clearAllLayers = () => {
    setSelectedLayers([]);
  };

  return (
    <LayerContext.Provider
      value={{
        availableLayers,
        selectedLayers,
        showLayers,
        isLoading,
        toggleLayer,
        toggleLayerVisibility,
        selectAllLayers,
        clearAllLayers,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
}

export function useLayerContext() {
  const context = useContext(LayerContext);
  if (context === undefined) {
    throw new Error("useLayerContext must be used within a LayerProvider");
  }
  return context;
}
