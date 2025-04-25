// src/lib/geoserver.ts

// Base GeoServer URL
const GEOSERVER_URL = "http://localhost:8080/geoserver";

// Function to get WMS URL for a specific workspace and layer
export function getWmsUrl(_workspace: string, _layer: string) {
  return `${GEOSERVER_URL}/wms`;
}

// Function to fetch available layers from GeoServer
export async function getAvailableLayers() {
  try {
    // You'll need to implement proper authentication if required
    const response = await fetch(`${GEOSERVER_URL}/rest/layers.json`, {
      headers: {
        // Add basic auth
        // user name is admin and password is geoserver
        Authorization: "Basic " + btoa("admin:geoserver"),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch layers");
    }

    const data = await response.json();

    console.log("Available layers:", data);

    return data.layers.layer || [];
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
  const url = new URL(`${GEOSERVER_URL}/wms`);
  url.searchParams.append("SERVICE", "WMS");
  url.searchParams.append("VERSION", "1.1.1");
  url.searchParams.append("REQUEST", "GetFeatureInfo");
  url.searchParams.append("LAYERS", `${workspace}:${layer}`);
  url.searchParams.append("QUERY_LAYERS", `${workspace}:${layer}`);
  url.searchParams.append("BBOX", bbox);
  url.searchParams.append("WIDTH", width.toString());
  url.searchParams.append("HEIGHT", height.toString());
  url.searchParams.append("X", x.toString());
  url.searchParams.append("Y", y.toString());
  url.searchParams.append("INFO_FORMAT", "application/json");
  url.searchParams.append("FEATURE_COUNT", "50");

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to get feature info");
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting feature info:", error);
    return null;
  }
}
