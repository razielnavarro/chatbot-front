"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "@/src/contexts/SessionContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapSection } from "@/components/map-section";
import { config } from "@/lib/config";

function AddressContent() {
  const { session, isLoading, error } = useSession();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if no session token
  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/error?message=Invalid or expired session");
    }
  }, [isLoading, session, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Show success state
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            ¡Dirección Guardada!
          </h2>
          <p className="text-gray-600 mb-4">
            Gracias por enviarnos tu dirección
          </p>
          <p className="text-sm text-gray-500">
            Puedes cerrar esta ventana y volver a WhatsApp
          </p>
        </div>
      </div>
    );
  }

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.token || !address.trim()) {
      console.error("No session token or address available");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${config.apiUrl}/api/sessions/${session.token}/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update address");
      }

      // Show success message
      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating address:", error);
      // Handle error (show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Selecciona tu Dirección de Entrega
            </CardTitle>
            <p className="text-center text-gray-600">
              Usa el mapa para seleccionar tu ubicación exacta
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Map Section */}
            <MapSection onAddressSelect={handleAddressSelect} />

            {/* Address Display */}
            {address && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Dirección seleccionada:
                </h3>
                <p className="text-blue-800">{address}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
              disabled={isSubmitting || !address.trim()}
            >
              {isSubmitting ? "Guardando..." : "Confirmar Dirección"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AddressPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      }
    >
      <AddressContent />
    </Suspense>
  );
}
