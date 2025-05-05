// src/components/map/area-form-dialog.tsx
"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAreasContext } from "@/contexts/areas-context";

export function AreaFormDialog() {
  const {
    isModalOpen,
    setIsModalOpen,
    selectedArea,
    isEditing,
    setIsEditing,
    addArea,
    updateArea,
    deleteArea,
    temporaryGeometry,
  } = useAreasContext();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Reset form when selectedArea changes
  useEffect(() => {
    if (selectedArea) {
      setName(selectedArea.name);
      setDescription(selectedArea.description);
    } else {
      setName("");
      setDescription("");
    }
    setError("");
  }, [selectedArea, isModalOpen]);

  const handleClose = () => {
    setIsModalOpen(false);
    setIsEditing(false);

    // If we were creating a new area but canceled, we need to clean up
    if (!selectedArea && temporaryGeometry) {
      // The parent component will handle cleaning up the temporary geometry
    }
  };

  const handleSave = () => {
    // Validate inputs
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    // If editing an existing area
    if (selectedArea) {
      updateArea(selectedArea.id, {
        name: name.trim(),
        description: description.trim(),
      });
    }
    // If creating a new area
    else if (temporaryGeometry) {
      addArea(name.trim(), description.trim(), temporaryGeometry);
    }

    // Close the dialog and reset state
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (selectedArea) {
      deleteArea(selectedArea.id);
    }
  };

  const dialogTitle = selectedArea
    ? isEditing
      ? "Edit Area of Interest"
      : "Area of Interest Details"
    : "Create New Area of Interest";

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {selectedArea && !isEditing
              ? "View details of the selected area of interest."
              : "Enter information about this area of interest."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              disabled={selectedArea && !isEditing}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={4}
              disabled={selectedArea && !isEditing}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {selectedArea && !isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="w-full sm:w-auto"
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSave}
                className="w-full sm:w-auto"
              >
                Save
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
