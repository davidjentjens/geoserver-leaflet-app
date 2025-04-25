// src/app/page.tsx
import MapComponent from "@/components/map/map-component";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">GeoServer Leaflet Integration</h1>
        <MapComponent />
      </div>
    </main>
  );
}