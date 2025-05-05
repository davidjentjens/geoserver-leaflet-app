// src/components/map/areas-panel.tsx
"use client";

import { PenSquare, Search, Trash } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAreasContext } from "@/contexts/areas-context";

export function AreasPanel() {
  const { areas, selectedArea, openEditModal, selectArea, deleteArea } =
    useAreasContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter areas based on search term
  const filteredAreas = useMemo(() => {
    if (!searchTerm) return areas;

    const term = searchTerm.toLowerCase();
    return areas.filter(
      (area) =>
        area.name.toLowerCase().includes(term) ||
        area.description.toLowerCase().includes(term),
    );
  }, [areas, searchTerm]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Areas of Interest</h2>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search areas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          {filteredAreas.length} {filteredAreas.length === 1 ? "area" : "areas"}{" "}
          found
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pt-0 space-y-4">
          {filteredAreas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No areas found
            </div>
          ) : (
            filteredAreas.map((area) => (
              <div
                key={area.id}
                className={`
                  border rounded-lg p-3 cursor-pointer
                  ${selectedArea?.id === area.id ? "bg-accent border-primary" : "hover:bg-accent/50"}
                `}
                onClick={() => selectArea(area.id)}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{area.name}</h3>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(area.id);
                      }}
                    >
                      <PenSquare className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteArea(area.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>

                {area.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {area.description}
                  </p>
                )}

                <div className="text-xs text-muted-foreground mt-2">
                  Created: {formatDate(area.createdAt)}
                  {area.updatedAt !== area.createdAt && (
                    <span className="ml-2">
                      • Updated: {formatDate(area.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
