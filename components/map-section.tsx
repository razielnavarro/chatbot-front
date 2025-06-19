"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Navigation } from "lucide-react";

interface MapSectionProps {
  onAddressSelect: (address: string) => void;
  initialAddress?: string;
}

export function MapSection({
  onAddressSelect,
  initialAddress,
}: MapSectionProps) {
  const [address, setAddress] = useState(initialAddress || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (address.trim()) {
      onAddressSelect(address.trim());
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Create a simple address string from coordinates
          const addressString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setAddress(addressString);
          onAddressSelect(addressString);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    onAddressSelect(newAddress);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-600" />
          Selecciona tu ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Ingresa tu dirección..."
              value={address}
              onChange={handleAddressChange}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} variant="outline">
            Buscar
          </Button>
        </div>

        {/* Current Location Button */}
        <Button
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isLoading ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
        </Button>

        {/* Static Map */}
        <div className="relative w-full h-64 rounded-lg border overflow-hidden bg-gray-100">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-red-600 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">
                {address
                  ? `Ubicación: ${address}`
                  : "Ingresa tu dirección para continuar"}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 text-center">
          Ingresa tu dirección de entrega para continuar con tu pedido
        </div>
      </CardContent>
    </Card>
  );
}
