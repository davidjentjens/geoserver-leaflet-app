// src/app/layers/page.tsx
"use client";

import { Layers } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLayerContext } from "@/contexts/layer-context";

export default function LayersPage() {
  const { availableLayers, isLoading } = useLayerContext();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Available Layers</h1>
        <Link href="/">
          <Button variant="outline">Back to Map</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))
        ) : availableLayers.length > 0 ? (
          // Actual layer cards
          availableLayers.map((layer) => (
            <Link href={`/layers/${layer.name}`} key={layer.name}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Layers className="w-4 h-4 mr-2" />
                    {layer.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click to view layer details
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          // No layers found
          <div className="col-span-3 text-center py-12">
            <p className="text-muted-foreground">No layers available</p>
          </div>
        )}
      </div>
    </div>
  );
}
