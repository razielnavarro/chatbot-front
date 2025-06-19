"use client";

import { useState } from "react";
import { MapSection } from "@/components/map-section";
import { AddressForm } from "@/components/address-form";
import { Header } from "@/components/header";

interface AddressDetails {
  additionalInfo: string;
  provincia: string;
  distrito: string;
  calle: string;
  zona: string;
  numero: string;
  codigoPostal: string;
}

const defaultAddressDetails: AddressDetails = {
  additionalInfo: "",
  provincia: "",
  distrito: "",
  calle: "",
  zona: "",
  numero: "",
  codigoPostal: "",
};

export default function AddressSelectionPage() {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [formData, setFormData] = useState<AddressDetails>(
    defaultAddressDetails
  );

  const handleAddressSelect = (
    address: string,
    details?: {
      provincia?: string;
      distrito?: string;
      calle?: string;
      zona?: string;
      numero?: string;
    }
  ) => {
    setSelectedAddress(address);

    // Update form data with new details from the map
    setFormData((prevData) => ({
      ...prevData,
      provincia: details?.provincia || prevData.provincia,
      distrito: details?.distrito || prevData.distrito,
      calle: details?.calle || prevData.calle,
      zona: details?.zona || prevData.zona,
      numero: details?.numero || prevData.numero,
    }));
  };

  const handleFormSubmit = (data: AddressDetails) => {
    // Here you would typically send the data to your backend
    console.log("Form submitted with data:", {
      fullAddress: selectedAddress,
      ...data,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Map Section */}
        <MapSection onAddressSelect={handleAddressSelect} />

        {/* Address Form */}
        <AddressForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
}
