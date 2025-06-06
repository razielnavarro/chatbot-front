"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AddressFormData {
  additionalInfo: string
  provincia: string
  distrito: string
  calle: string
  zona: string
  numero: string
  codigoPostal: string
}

interface AddressFormProps {
  formData: AddressFormData
  setFormData: (data: AddressFormData) => void
  onSubmit: (data: AddressFormData) => void
}

export function AddressForm({ formData, setFormData, onSubmit }: AddressFormProps) {
  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Por favor completa lo que sea relevante para ti:
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Additional Information */}
            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
                Información adicional
              </Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                placeholder="Puedes agregar cualquier información adicional que nos pueda servir para llegar más rápido (entre qué calles está, alguna referencia, etc.)"
                className="min-h-20 bg-gray-50 border-gray-200 resize-none"
                rows={3}
              />
            </div>

            {/* Address Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provincia" className="text-sm font-medium text-gray-700">
                  Provincia
                </Label>
                <Input
                  id="provincia"
                  value={formData.provincia}
                  onChange={(e) => handleInputChange("provincia", e.target.value)}
                  className="bg-gray-50 border-gray-200"
                  placeholder="Provincia de Chiriquí"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distrito" className="text-sm font-medium text-gray-700">
                  Distrito
                </Label>
                <Input
                  id="distrito"
                  value={formData.distrito}
                  onChange={(e) => handleInputChange("distrito", e.target.value)}
                  className="bg-gray-50 border-gray-200"
                  placeholder="Distrito de David"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calle" className="text-sm font-medium text-gray-700">
                  Calle
                </Label>
                <Input
                  id="calle"
                  value={formData.calle}
                  onChange={(e) => handleInputChange("calle", e.target.value)}
                  className="bg-gray-50 border-gray-200"
                  placeholder="3ra Oeste"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zona" className="text-sm font-medium text-gray-700">
                  Zona
                </Label>
                <Input
                  id="zona"
                  value={formData.zona}
                  onChange={(e) => handleInputChange("zona", e.target.value)}
                  className="bg-gray-50 border-gray-200"
                  placeholder="David"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero" className="text-sm font-medium text-gray-700">
                  Número
                </Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleInputChange("numero", e.target.value)}
                  className="bg-gray-50 border-gray-200"
                  placeholder="335-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigoPostal" className="text-sm font-medium text-gray-700">
                  Código Postal
                </Label>
                <Input
                  id="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                  className="bg-gray-50 border-gray-200"
                  placeholder="Código Postal"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-lg"
                size="lg"
              >
                ENVIAR
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
