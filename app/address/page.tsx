"use client"

import { useState } from "react"
import { MapSection } from "@/components/map-section"
import { AddressForm } from "@/components/address-form"
import { Header } from "@/components/header"

export default function AddressSelectionPage() {
  const [selectedAddress, setSelectedAddress] = useState("")
  const [formData, setFormData] = useState({
    additionalInfo: "",
    provincia: "Provincia de Chiriquí",
    distrito: "Distrito de David",
    calle: "3ra Oeste",
    zona: "David",
    numero: "335-12",
    codigoPostal: "",
  })

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address)
  }

  const handleFormSubmit = (data: typeof formData) => {
    console.log("Form submitted:", data)
    // Handle form submission logic here
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="w-full">
        {/* Map Section */}
        <MapSection selectedAddress={selectedAddress} onAddressSelect={handleAddressSelect} />

        {/* Address Form */}
        <AddressForm formData={formData} setFormData={setFormData} onSubmit={handleFormSubmit} />
      </div>
    </div>
  )
}
