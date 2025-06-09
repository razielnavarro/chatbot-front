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
  formData: AddressFormData;
  setFormData: (data: AddressFormData) => void;
  onSubmit: (data: AddressFormData) => void;
}

export function AddressForm({
  formData,
  setFormData,
  onSubmit,
}: AddressFormProps) {
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(
    new Set()
  );

  // Track which fields were auto-filled from the map
  useEffect(() => {
    const newAutoFilledFields = new Set<string>();

    Object.entries(formData).forEach(([key, value]) => {
      if (value && key !== "additionalInfo" && key !== "codigoPostal") {
        newAutoFilledFields.add(key);
      }
    });

    setAutoFilledFields(newAutoFilledFields);
  }, [formData]);

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (
    field: keyof AddressFormData,
    label: string,
    placeholder: string
  ) => {
    const isAutoFilled = autoFilledFields.has(field);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={field} className="text-sm font-medium text-gray-700">
            {label}
          </Label>
          {isAutoFilled && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-600 border-blue-200"
            >
              Auto-completado
            </Badge>
          )}
        </div>
        <Input
          id={field}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`bg-gray-50 border-gray-200 ${
            isAutoFilled ? "border-blue-200 bg-blue-50" : ""
          }`}
          placeholder={placeholder}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Por favor completa o verifica los detalles de tu dirección:
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Additional Information */}
            <div className="space-y-2">
              <Label
                htmlFor="additionalInfo"
                className="text-sm font-medium text-gray-700"
              >
                Información adicional
              </Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) =>
                  handleInputChange("additionalInfo", e.target.value)
                }
                placeholder="Puedes agregar cualquier información adicional que nos pueda servir para llegar más rápido (entre qué calles está, alguna referencia, etc.)"
                className="min-h-20 bg-gray-50 border-gray-200 resize-none"
                rows={3}
              />
            </div>

            {/* Address Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("provincia", "Provincia", "Provincia de Chiriquí")}
              {renderField("distrito", "Distrito", "Distrito de David")}
              {renderField("calle", "Calle", "3ra Oeste")}
              {renderField("zona", "Zona", "David")}
              {renderField("numero", "Número", "335-12")}
              {renderField("codigoPostal", "Código Postal", "Código Postal")}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-lg"
                size="lg"
              >
                CONFIRMAR DIRECCIÓN
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
