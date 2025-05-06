import { AreaOfInterest } from "@/contexts/areas-context";

interface GetSelectionColorParams {
  area: AreaOfInterest;
  selectedArea: AreaOfInterest | undefined;
  enableEditInterface: boolean;
}

export const getSelectionColor = ({
  area,
  selectedArea,
  enableEditInterface,
}: GetSelectionColorParams): string => {
  let color;

  // Set color based on the selection state
  if (selectedArea?.id === area.id && enableEditInterface) {
    // Pink color for selected area in edit mode
    color = "var(--chart-1)"; // Selected color
  } else if (selectedArea?.id === area.id && !enableEditInterface) {
    // Orange color for selected area when not in edit mode
    color = "var(--chart-5)";
  } else {
    // Default color for unselected areas
    color = "var(--chart-3)"; // Default color
  }

  return color;
};
