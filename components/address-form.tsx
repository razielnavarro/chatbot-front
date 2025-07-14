"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AddressFormData {
  additionalInfo: string;
  provincia: string;
  distrito: string;
  calle: string;
  zona: string;
  numero: string;
  codigoPostal: string;
}

interface AddressFormProps {
  address: string;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function AddressForm({
  address,
  onSubmit,
  isSubmitting = false,
}: AddressFormProps) {
  return (
    <div className="container mx-auto px-2 py-4 max-w-md sm:max-w-lg md:max-w-full">
      <div className="flex flex-col items-center justify-center">
        <p className="mb-4 text-center text-base font-semibold text-gray-900">
          Dirección seleccionada:
        </p>
        <div className="mb-6 px-4 py-2 bg-gray-100 rounded text-sm text-gray-700 w-full text-center">
          {address || "Selecciona una dirección en el mapa"}
        </div>
        <button
          type="button"
          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded disabled:opacity-50"
          onClick={onSubmit}
          disabled={isSubmitting || !address}
        >
          {isSubmitting ? "ENVIANDO..." : "CONFIRMAR DIRECCIÓN"}
        </button>
      </div>
    </div>
  );
}
