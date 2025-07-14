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
  };

  const sendAddressToN8N = async () => {
    if (!selectedAddress || !coordinates) return;
    try {
      setIsSubmitting(true);
      const payload = {
        order_id: orderId,
        fullAddress: selectedAddress,
        coordinates: coordinates,
        timestamp: new Date().toISOString(),
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <MapSection
          selectedAddress={selectedAddress}
          onAddressSelect={handleAddressSelect}
        />
        <div className="flex flex-col items-center justify-center mt-4">
          <button
            type="button"
            className="w-full max-w-md bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded disabled:opacity-50"
            onClick={sendAddressToN8N}
            disabled={isSubmitting || !selectedAddress || !coordinates}
          >
            {isSubmitting ? "ENVIANDO..." : "CONFIRMAR DIRECCIÓN"}
          </button>
        </div>
      </div>
    </div>
  );
}
