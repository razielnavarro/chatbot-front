"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import Image from "next/image";

// David, Chiriquí coordinates (fallback)
const DEFAULT_CENTER = {
  lat: 8.4273,
  lng: -82.4308,
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const libraries: ["places"] = ["places"];

interface MapSectionProps {
  selectedAddress: string;
  onAddressSelect: (
    address: string,
    details?: {
      provincia?: string;
      distrito?: string;
      calle?: string;
      zona?: string;
      numero?: string;
    },
    coordinates?: {
      lat: number;
      lng: number;
    }
  ) => void;
}

export function MapSection({
  selectedAddress,
  onAddressSelect,
}: MapSectionProps) {
  const [searchValue, setSearchValue] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Use a ref to track if we should update the center
  const shouldUpdateCenter = useRef(true);
  const isUserTyping = useRef(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userDragged = useRef(false);

  let idleTimeout: NodeJS.Timeout | null = null;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Get user's current location on component mount
  useEffect(() => {
    if (!isLoaded) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          shouldUpdateCenter.current = true;

          if (map) {
            map.setCenter(userLocation);
            updateAddressFromCoordinates(userLocation.lat, userLocation.lng);
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setIsLocating(false);
    }
  }, [isLoaded, map]);

  const parseAddressComponents = (results: google.maps.GeocoderResult[]) => {
    const addressComponents = results[0].address_components;
    const details: { [key: string]: string } = {};

    for (const component of addressComponents) {
      const types = component.types;

      if (types.includes("administrative_area_level_1")) {
        details.provincia = component.long_name;
      }
      if (
        types.includes("locality") ||
        types.includes("administrative_area_level_2")
      ) {
        details.distrito = component.long_name;
      }
      if (types.includes("route")) {
        details.calle = component.long_name;
      }
      if (types.includes("sublocality") || types.includes("neighborhood")) {
        details.zona = component.long_name;
      }
      if (types.includes("street_number")) {
        details.numero = component.long_name;
      }
    }

    return details;
  };

  // Function to update address from coordinates
  const updateAddressFromCoordinates = useCallback(
    (lat: number, lng: number) => {
      if (isUpdatingAddress || isUserTyping.current) return;
      setIsUpdatingAddress(true);

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const address = results[0].formatted_address;
          setSearchValue(address);
          const details = parseAddressComponents(results);
          onAddressSelect(address, details, { lat, lng });
        }
        setIsUpdatingAddress(false);
      });
    },
    [isUpdatingAddress, onAddressSelect]
  );

  // Debounced update address when map stops moving
  const onLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      if (!mapInstance) return;
      setMap(mapInstance);

      // Add drag start listener
      mapInstance.addListener("dragstart", () => {
        setIsDragging(true);
        setShowPredictions(false);
        userDragged.current = true;
      });

      // Add drag end listener
      mapInstance.addListener("dragend", () => {
        setIsDragging(false);
      });

      mapInstance.addListener("idle", () => {
        if (!userDragged.current) return;

        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

        idleTimeoutRef.current = setTimeout(() => {
          const mapCenter = mapInstance.getCenter();
          if (!mapCenter) return;

          const newLat = mapCenter.lat();
          const newLng = mapCenter.lng();

          const latDiff = Math.abs(center.lat - newLat);
          const lngDiff = Math.abs(center.lng - newLng);

          const THRESHOLD = 0.0001; // ~11 meters
          const COOLDOWN_MS = 1500;

          if (latDiff > THRESHOLD || lngDiff > THRESHOLD) {
            const newCenter = { lat: newLat, lng: newLng };
            setCenter(newCenter);
            updateAddressFromCoordinates(newLat, newLng);
          }

          // After one call, reset drag flag to prevent more calls on idle
          userDragged.current = false;
        }, 1500);
      });
    },
    [center.lat, center.lng, updateAddressFromCoordinates]
  );

  // Handle search input changes
  const handleSearchChange = useCallback(
    (value: string) => {
      isUserTyping.current = true;
      setSearchValue(value);
      if (!value) {
        setPredictions([]);
        setShowPredictions(false);
        return;
      }

      // Use Places Autocomplete service
      if (isLoaded) {
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          {
            input: value,
            componentRestrictions: { country: "pa" }, // Restrict to Panama
          },
          (predictions, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              predictions
            ) {
              setPredictions(predictions);
              setShowPredictions(true);
            } else {
              setPredictions([]);
              setShowPredictions(false);
            }
          }
        );
      }
    },
    [isLoaded]
  );

  // Handle prediction selection
  const handlePredictionSelect = useCallback(
    (prediction: google.maps.places.AutocompletePrediction) => {
      if (!map) return;

      const placesService = new google.maps.places.PlacesService(map);
      placesService.getDetails(
        {
          placeId: prediction.place_id,
          fields: ["geometry", "formatted_address", "address_components"],
        },
        (place, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place?.geometry?.location
          ) {
            const newPos = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };

            shouldUpdateCenter.current = true;
            setCenter(newPos);
            map.setCenter(newPos);

            if (place.formatted_address) {
              setSearchValue(place.formatted_address);
              if (place.address_components) {
                const details = parseAddressComponents([
                  {
                    address_components: place.address_components,
                    formatted_address: place.formatted_address,
                    geometry: {
                      location: place.geometry.location,
                      viewport: place.geometry.viewport,
                    } as unknown as google.maps.GeocoderGeometry,
                    place_id: place.place_id!,
                    types: [],
                  },
                ]);
                onAddressSelect(place.formatted_address, details, newPos);
              } else {
                onAddressSelect(place.formatted_address, undefined, newPos);
              }
            }
          }
        }
      );
      setShowPredictions(false);
      isUserTyping.current = false;
    },
    [map, onAddressSelect]
  );

  // Handle input blur
  const handleInputBlur = useCallback(() => {
    // Small delay to allow for prediction selection
    setTimeout(() => {
      isUserTyping.current = false;
    }, 200);
  }, []);

  if (loadError) {
    return (
      <div className="h-80 md:h-96 flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded || isLocating) {
    return (
      <div className="h-80 md:h-96 flex items-center justify-center bg-gray-100">
        <p>{isLocating ? "Localizando tu ubicación..." : "Loading maps..."}</p>
      </div>
    );
  }

  return (
    <div className="relative h-[50vh] w-full">
      {/* Map Container */}
      <div className="h-80 md:h-96 relative overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={17}
          onLoad={onLoad}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            gestureHandling: "greedy",
          }}
        >
          {/* Center Marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none z-50">
            <img
              src="/assets/icons/Map-Pin.svg"
              alt="Map Pin"
              className="h-9 w-9"
            />
          </div>
        </GoogleMap>

        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar dirección..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onBlur={handleInputBlur}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg shadow-md"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            {searchValue && (
              <button
                onClick={() => {
                  setSearchValue("");
                  setPredictions([]);
                  setShowPredictions(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Predictions Dropdown */}
          {showPredictions && !isDragging && predictions.length > 0 && (
            <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
              {predictions.map((prediction) => (
                <button
                  key={prediction.place_id}
                  onClick={() => handlePredictionSelect(prediction)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                >
                  {prediction.description}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-600 text-white px-4 py-3">
        <div className="container mx-auto flex items-center space-x-3">
          <MapPin className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            Ingresa tu dirección o mueve el mapa para señalar tu ubicación
            exacta
          </p>
        </div>
      </div>
    </div>
  );
}
