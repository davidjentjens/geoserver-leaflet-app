// src/contexts/areas-context.tsx
"use client";

import type { Feature, FeatureCollection } from "geojson";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Interface for an area of interest
export interface AreaOfInterest {
  id: string;
  name: string;
  description: string;
  geometry: Feature;
  createdAt: string;
  updatedAt: string;
}

interface AreasContextType {
  areas: AreaOfInterest[];
  selectedArea: AreaOfInterest | undefined;
  isModalOpen: boolean;
  isEditing: boolean;
  temporaryGeometry: Feature | undefined;
  showAreas: boolean;
  enableEditInterface: boolean;

  // Methods
  addArea: (name: string, description: string, geometry: Feature) => void;
  updateArea: (id: string, data: Partial<AreaOfInterest>) => void;
  deleteArea: (id: string) => void;
  selectArea: (id: string | undefined) => void;
  openEditModal: (id: string | undefined) => void;
  setIsModalOpen: (open: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  setTemporaryGeometry: (geometry: Feature | undefined) => void;
  getAreasAsGeoJSON: () => FeatureCollection;
  setShowAreas: (show: boolean) => void;
  setEnableEditInterface: (enable: boolean) => void;
}

const AreasContext = createContext<AreasContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "geoserver-areas-of-interest";

export function AreasProvider({ children }: { children: ReactNode }) {
  const [areas, setAreas] = useState<AreaOfInterest[]>([]);
  const [showAreas, setShowAreas] = useState<boolean>(false);
  const [enableEditInterface, setEnableEditInterface] =
    useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<AreaOfInterest | undefined>(
    undefined,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [temporaryGeometry, setTemporaryGeometry] = useState<
    Feature | undefined
  >(undefined);

  // Load areas from local storage
  useEffect(() => {
    const storedAreas = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedAreas) {
      try {
        setAreas(JSON.parse(storedAreas));
      } catch (error) {
        console.error("Failed to parse stored areas:", error);
      }
    }
  }, []);

  // Save areas to local storage when they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(areas));
  }, [areas]);

  // Add a useEffect to handle the case when the user de-selects an area
  useEffect(() => {
    if (!selectedArea) {
      setIsEditing(false);
      setIsModalOpen(false);
    }
  }, [selectedArea]);

  // Add a new area
  const addArea = (name: string, description: string, geometry: Feature) => {
    const newArea: AreaOfInterest = {
      id: Date.now().toString(), // Simple ID generation
      name,
      description,
      geometry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAreas((prev) => [...prev, newArea]);
    setTemporaryGeometry(undefined);
  };

  // Update an existing area
  const updateArea = (id: string, data: Partial<AreaOfInterest>) => {
    setAreas((prev) =>
      prev.map((area) =>
        area.id === id
          ? {
              ...area,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : area,
      ),
    );

    // If we updated the currently selected area, update that too
    if (selectedArea?.id === id) {
      setSelectedArea((prev) =>
        prev
          ? { ...prev, ...data, updatedAt: new Date().toISOString() }
          : undefined,
      );
    }
  };

  // Delete an area
  const deleteArea = (id: string) => {
    setAreas((prev) => prev.filter((area) => area.id !== id));

    // If the deleted area was selected, clear the selection
    if (selectedArea?.id === id) {
      setSelectedArea(undefined);
      setIsModalOpen(false);
    }
  };

  // Select an area
  const selectArea = (id: string | undefined) => {
    if (!id) {
      setSelectedArea(undefined);
      return;
    }

    const area = areas.find((a) => a.id === id);
    if (area) {
      setSelectedArea(area);
      setIsEditing(true);
    }
  };

  // Open the modal for editing an area
  const openEditModal = (id: string | undefined) => {
    if (!id) {
      setIsModalOpen(false);
      return;
    }
    const area = areas.find((a) => a.id === id);
    if (area) {
      setSelectedArea(area);
      setIsModalOpen(true);
    }
  };

  // Convert areas to GeoJSON FeatureCollection
  const getAreasAsGeoJSON = (): FeatureCollection => {
    return {
      type: "FeatureCollection",
      features: areas.map((area) => ({
        ...area.geometry,
        properties: {
          ...area.geometry.properties,
          id: area.id,
          name: area.name,
          description: area.description,
        },
      })),
    };
  };

  return (
    <AreasContext.Provider
      value={{
        areas,
        selectedArea,
        isModalOpen,
        isEditing,
        temporaryGeometry,
        showAreas,
        enableEditInterface,
        addArea,
        updateArea,
        deleteArea,
        openEditModal,
        selectArea,
        setIsModalOpen,
        setIsEditing,
        setTemporaryGeometry,
        getAreasAsGeoJSON,
        setShowAreas,
        setEnableEditInterface,
      }}
    >
      {children}
    </AreasContext.Provider>
  );
}

export function useAreasContext() {
  const context = useContext(AreasContext);
  if (context === undefined) {
    throw new Error("useAreasContext must be used within an AreasProvider");
  }
  return context;
}
