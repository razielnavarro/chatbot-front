"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

// David, Chiriquí coordinates
const DEFAULT_CENTER = {
  lat: 8.4273,
  lng: -82.4308,
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const libraries: "places"[] = ["places"];

interface MapSectionProps {
  selectedAddress: string;
  onAddressSelect: (address: string) => void;
}

export function MapSection({
  selectedAddress,
  onAddressSelect,
}: MapSectionProps) {
  const [searchValue, setSearchValue] = useState("");
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [markerPosition, setMarkerPosition] = useState(DEFAULT_CENTER);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    // Create SearchBox
    const input = document.getElementById("pac-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    setSearchBox(searchBox);

    // Bias SearchBox results towards current map's viewport
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    });
  }, []);

  const onMarkerDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });

        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            const address = results[0].formatted_address;
            setSearchValue(address);
            onAddressSelect(address);
          }
        });
      }
    },
    [onAddressSelect]
  );

  useEffect(() => {
    if (!searchBox || !map) return;

    // Listen for searchBox place selection
    const listener = searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (!places?.length) return;

      const place = places[0];
      if (!place.geometry?.location) return;

      // Update map and marker position
      const newPos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      setCenter(newPos);
      setMarkerPosition(newPos);
      map.setCenter(newPos);

      if (place.formatted_address) {
        setSearchValue(place.formatted_address);
        onAddressSelect(place.formatted_address);
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [searchBox, map, onAddressSelect]);

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="h-80 md:h-96 relative overflow-hidden">
        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          libraries={libraries}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
          >
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={onMarkerDragEnd}
            />
          </GoogleMap>
        </LoadScript>

        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="pac-input"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-10 bg-white shadow-lg border-0 h-12 text-sm"
              placeholder="Buscar dirección..."
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchValue("")}
            >
              ×
            </Button>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-600 text-white px-4 py-3">
        <div className="container mx-auto flex items-center space-x-3">
          <MapPin className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            Ingresa tu dirección o ingresa una ubicación cercana. Luego arrastra
            el marcador para señalar tu dirección precisa
          </p>
        </div>
      </div>
    </div>
  );
}
