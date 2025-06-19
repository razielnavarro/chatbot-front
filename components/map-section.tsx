"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import { config } from "@/lib/config";

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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Initialize map
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 8.538, lng: -82.427 }, // David, Panama
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Initialize marker
    const markerInstance = new window.google.maps.Marker({
      position: { lat: 8.538, lng: -82.427 },
      map: mapInstance,
      draggable: false,
      title: "Tu ubicación",
    });

    // Initialize autocomplete
    if (inputRef.current) {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "pa" },
        }
      );

      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          mapInstance.setCenter({ lat, lng });
          markerInstance.setPosition({ lat, lng });

          const addressString = place.formatted_address || "";
          setAddress(addressString);
          onAddressSelect(addressString);
        }
      });

      setAutocomplete(autocompleteInstance);
    }

    // Add map click listener
    mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        markerInstance.setPosition({ lat, lng });

        // Reverse geocode to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const addressString = results[0].formatted_address;
            setAddress(addressString);
            onAddressSelect(addressString);
          }
        });
      }
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const handleSearch = () => {
    if (!autocomplete || !inputRef.current) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        if (map && marker && location) {
          map.setCenter(location);
          marker.setPosition(location);
          const addressString = results[0].formatted_address;
          setAddress(addressString);
          onAddressSelect(addressString);
        }
      }
    });
  };

  const handleUseCurrentLocation = () => {
    setIsLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (map && marker) {
            map.setCenter({ lat, lng });
            marker.setPosition({ lat, lng });

            // Reverse geocode to get address
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                const addressString = results[0].formatted_address;
                setAddress(addressString);
                onAddressSelect(addressString);
              }
              setIsLoading(false);
            });
          }
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
              ref={inputRef}
              type="text"
              placeholder="Busca tu dirección..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
          {isLoading ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
        </Button>

        {/* Map */}
        <div
          ref={mapRef}
          className="w-full h-64 rounded-lg border"
          style={{ minHeight: "256px" }}
        />

        {/* Google Attribution */}
        <div className="text-xs text-gray-500 text-center">
          Powered by Google Maps
        </div>
      </CardContent>
    </Card>
  );
}
