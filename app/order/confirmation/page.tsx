"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            ¡Pedido Confirmado!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tu pedido #{orderId} ha sido recibido y está siendo procesado.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Recibirás una confirmación por WhatsApp cuando tu pedido esté listo.
          </p>
        </div>
        <div className="mt-8">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={() => (window.location.href = "/")}
          >
            Volver al menú
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
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
      <ConfirmationContent />
    </Suspense>
  );
}
