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
    setFormData({ ...formData, [field]: value });
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
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor={field} className="text-xs font-medium text-gray-700">
            {label}
          </Label>
          {isAutoFilled && (
            <Badge
              variant="outline"
              className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 border-blue-200"
            >
              Auto
            </Badge>
          )}
        </div>
        <Input
          id={field}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`h-8 text-sm bg-gray-50 border-gray-200 ${
            isAutoFilled ? "border-blue-200 bg-blue-50" : ""
          }`}
          placeholder={placeholder}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-2 py-4 max-w-md sm:max-w-lg md:max-w-full">
      <Card className="p-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-900">
            Verifica tu dirección:
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div className="space-y-1">
              <Label
                htmlFor="additionalInfo"
                className="text-xs font-medium text-gray-700"
              >
                Información adicional
              </Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) =>
                  handleInputChange("additionalInfo", e.target.value)
                }
                placeholder="Referencias, puntos cercanos, entre calles..."
                className="resize-none h-16 text-sm bg-gray-50 border-gray-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {renderField("provincia", "Provincia", "Ej: Chiriquí")}
              {renderField("distrito", "Distrito", "Ej: David")}
              {renderField("calle", "Calle", "Ej: 3ra Oeste")}
              {renderField("zona", "Zona", "Ej: David")}
              {renderField("numero", "Número", "Ej: 335-12")}
              {renderField("codigoPostal", "Código Postal", "")}
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2"
            >
              CONFIRMAR DIRECCIÓN
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
