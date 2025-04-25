"use client";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/map/map-component"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          GeoServer Leaflet Integration
        </h1>
        <MapComponent />
      </div>
    </main>
  );
}
