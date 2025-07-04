"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapSection } from "@/components/map-section";
import { AddressForm } from "@/components/address-form";

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

export default function AddressPageClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const resumeUrl = searchParams.get("resumeUrl");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [formData, setFormData] = useState<AddressDetails>(
    defaultAddressDetails
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleAddressSelect = (
    address: string,
    details?: {
      provincia?: string;
      distrito?: string;
      calle?: string;
      zona?: string;
      numero?: string;
    },
    coords?: {
      lat: number;
      lng: number;
    }
  ) => {
    setSelectedAddress(address);
    if (coords) {
      setCoordinates(coords);
    }
    setFormData((prevData) => ({
      ...prevData,
      provincia: details?.provincia || prevData.provincia,
      distrito: details?.distrito || prevData.distrito,
      calle: details?.calle || prevData.calle,
      zona: details?.zona || prevData.zona,
      numero: details?.numero || prevData.numero,
    }));
  };

  const sendAddressToN8N = async (data: AddressDetails) => {
    try {
      setIsSubmitting(true);
      const payload = {
        order_id: orderId,
        fullAddress: selectedAddress,
        addressDetails: {
          ...data,
          coordinates: coordinates || { lat: 0, lng: 0 },
          timestamp: new Date().toISOString(),
        },
        source: "whatsapp_ordering_system",
      };
      const endpoint =
        resumeUrl ||
        process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
        "https://your-n8n-instance.com/webhook/address-confirmation";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      alert("Dirección confirmada y enviada exitosamente");
    } catch (error) {
      alert("Error al enviar la dirección. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: AddressDetails) => {
    await sendAddressToN8N(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <MapSection
          selectedAddress={selectedAddress}
          onAddressSelect={handleAddressSelect}
        />
        <AddressForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
