// src/app/api/geoserver/route.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get("endpoint") || "layers.json";

  console.log(
    `Proxying request to: http://localhost:8080/geoserver/rest/${endpoint}`,
  );

  try {
    const response = await fetch(
      `http://localhost:8080/geoserver/rest/${endpoint}`,
      {
        headers: {
          Authorization:
            "Basic " + Buffer.from("admin:password").toString("base64"),
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch from GeoServer: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GeoServer API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch from GeoServer" },
      { status: 500 },
    );
  }
}
