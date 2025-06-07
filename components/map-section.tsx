"use client";

import { useState, useCallback, useEffect } from "react";
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
  onAddressSelect: (address: string) => void;
}

export function MapSection({
  selectedAddress,
  onAddressSelect,
}: MapSectionProps) {
  const [searchValue, setSearchValue] = useState("");
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showPredictions, setShowPredictions] = useState(false);

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

          // Reverse geocode to get address
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: userLocation }, (results, status) => {
            if (status === "OK" && results?.[0]) {
              const address = results[0].formatted_address;
              setSearchValue(address);
              onAddressSelect(address);
            }
          });
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
  }, [isLoaded, onAddressSelect]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    // Update address when map stops moving
    map.addListener("idle", () => {
      const center = map.getCenter();
      if (center) {
        const lat = center.lat();
        const lng = center.lng();
        updateAddressFromCoordinates(lat, lng);
      }
    });
  }, []);

  // Handle search input changes
  const handleSearchChange = useCallback(
    (value: string) => {
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
            // types: ["establishment", "geocode"],
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
          fields: ["geometry", "formatted_address"],
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
            setCenter(newPos);
            map.setCenter(newPos);
            if (place.formatted_address) {
              setSearchValue(place.formatted_address);
              onAddressSelect(place.formatted_address);
            }
          }
        }
      );
      setShowPredictions(false);
    },
    [map, onAddressSelect]
  );

  // Debounced function to update address from coordinates
  const updateAddressFromCoordinates = useCallback(
    (lat: number, lng: number) => {
      if (isUpdatingAddress) return;
      setIsUpdatingAddress(true);

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const address = results[0].formatted_address;
          setSearchValue(address);
          onAddressSelect(address);
        }
        setTimeout(() => setIsUpdatingAddress(false), 500);
      });
    },
    [onAddressSelect, isUpdatingAddress]
  );

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
    <div className="relative">
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
          }}
        >
          {/* Center Marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none z-50">
            <MapPin className="h-8 w-8 text-red-600" />
          </div>
        </GoogleMap>

        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 z-10 w-full max-w-md">
          <div className="relative">
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-10 bg-white shadow-lg border-0 h-12 text-sm rounded-t-lg"
                  placeholder="Ingresa tu dirección o ingresa una ubicación cercana"
                  onFocus={() => setShowPredictions(true)}
                />
                {searchValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => {
                      setSearchValue("");
                      setPredictions([]);
                      setShowPredictions(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Predictions Dropdown */}
              {/* Predictions Dropdown */}
              {showPredictions && predictions.length > 0 && (
                <div className="absolute w-full bg-white shadow-lg rounded-b-lg border-t">
                  {predictions.map((prediction) => (
                    <button
                      key={prediction.place_id}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-start"
                      onClick={() => handlePredictionSelect(prediction)}
                    >
                      <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                      <div>
                        <div className="font-medium">
                          {prediction.structured_formatting.main_text}
                        </div>
                        <div className="text-sm text-gray-500">
                          {prediction.structured_formatting.secondary_text}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Powered by Google — only shown when dropdown is visible */}
                  <div className="px-4 py-2 border-t bg-white flex justify-end">
                    <img
                      src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png"
                      alt="Powered by Google"
                      className="h-3"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
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
