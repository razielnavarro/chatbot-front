"use client"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MapSectionProps {
  selectedAddress: string
  onAddressSelect: (address: string) => void
}

export function MapSection({ selectedAddress, onAddressSelect }: MapSectionProps) {
  const [searchValue, setSearchValue] = useState("3ra Oeste 335-12, David, Provincia de Chiriquí, Panamá")

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="h-80 md:h-96 bg-gray-200 relative overflow-hidden">
        {/* Simulated Google Maps */}
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/placeholder.svg?height=400&width=800&text=Google+Maps+View')`,
          }}
        >
          {/* Map overlay with streets pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              <defs>
                <pattern id="streets" patternUnits="userSpaceOnUse" width="40" height="40">
                  <rect width="40" height="40" fill="#f0f0f0" />
                  <path d="M 0,20 l 40,0" stroke="#ddd" strokeWidth="1" />
                  <path d="M 20,0 l 0,40" stroke="#ddd" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#streets)" />
            </svg>
          </div>

          {/* Location marker */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <MapPin className="h-8 w-8 text-red-600 drop-shadow-lg" fill="currentColor" />
          </div>
        </div>

        {/* Search Bar Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
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

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <Button variant="outline" size="sm" className="bg-white shadow-lg h-10 w-10 p-0">
            +
          </Button>
          <Button variant="outline" size="sm" className="bg-white shadow-lg h-10 w-10 p-0">
            −
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-600 text-white px-4 py-3">
        <div className="container mx-auto flex items-center space-x-3">
          <MapPin className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            Ingresa tu dirección o ingresa una ubicación cercana. Luego arrastra el mapa para señalar tu dirección
            precisa
          </p>
        </div>
      </div>
    </div>
  )
}
