"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
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

  const sendAddressToN8N = async (data: AddressDetails) => {
    try {
      setIsSubmitting(true);

      const payload = {
        order_id: orderId,
        fullAddress: selectedAddress,
        addressDetails: {
          ...data,
          coordinates: coordinates || {
            lat: 0, // You can add actual coordinates if needed
            lng: 0,
          },
          timestamp: new Date().toISOString(),
        },
        source: "whatsapp_ordering_system",
      };

      // Replace this URL with your actual N8N webhook URL
      const n8nWebhookUrl =
        process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
        "https://your-n8n-instance.com/webhook/address-confirmation";

      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Address sent successfully to N8N:", result);

      // You can add success notification here
      alert("Dirección confirmada y enviada exitosamente");
    } catch (error) {
      console.error("Error sending address to N8N:", error);
      alert("Error al enviar la dirección. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: AddressDetails) => {
    // Send the address data to N8N
    await sendAddressToN8N(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        {/* Map Section */}
        <MapSection
          selectedAddress={selectedAddress}
          onAddressSelect={handleAddressSelect}
        />

        {/* Address Form */}
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
