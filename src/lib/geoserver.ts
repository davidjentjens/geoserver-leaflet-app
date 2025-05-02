// Updated geoserver.ts
export const GEOSERVER_URL = "http://localhost:8080/geoserver";
export const GEOSERVER_REST_URL = `${GEOSERVER_URL}/rest`;
export const API_PROXY_URL = "/api/geoserver"; // Your Next.js API route

// Function to get WMS URL for a specific workspace and layer
export function getWmsUrl(_workspace: string, _layer: string) {
  // Keep the direct URL for WMS as it's used for the map tiles
  return `${GEOSERVER_REST_URL}/wms`;
}

// Function to fetch available layers from GeoServer
export async function getAvailableLayers() {
  try {
    // Use the API route instead of direct call
    const response = await fetch(`${API_PROXY_URL}?endpoint=layers.json`);

    if (!response.ok) {
      throw new Error("Failed to fetch layers");
    }

    const data = await response.json();

    // Process the layers data to return the expected format
    if (data.layers && data.layers.layer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.layers.layer.map((layer: any) => ({
        name: layer.name,
        href: layer.href,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching GeoServer layers:", error);
    return [];
  }
}

// Function to get feature info from a layer
export async function getFeatureInfo(
  workspace: string,
  layer: string,
  bbox: string,
  width: number,
  height: number,
  x: number,
  y: number,
) {
  // For GetFeatureInfo requests, you may want to create another API endpoint
  // or modify the existing one to handle different types of requests
  const params = new URLSearchParams({
    SERVICE: "WMS",
    VERSION: "1.1.1",
    REQUEST: "GetFeatureInfo",
    LAYERS: `${workspace}:${layer}`,
    QUERY_LAYERS: `${workspace}:${layer}`,
    BBOX: bbox,
    WIDTH: width.toString(),
    HEIGHT: height.toString(),
    X: x.toString(),
    Y: y.toString(),
    INFO_FORMAT: "application/json",
    FEATURE_COUNT: "50",
  });

  // For WMS requests, continue using the direct URL as these are accessed by the map component
  const url = `${GEOSERVER_REST_URL}/wms?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to get feature info");
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting feature info:", error);
    return null;
  }
}
