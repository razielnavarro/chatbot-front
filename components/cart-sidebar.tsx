"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { config } from "@/lib/config";
import type { CartItem } from "@/app/page";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (
    itemName: string,
    priceLabel: string,
    quantity: number
  ) => void;
  onRemoveItem: (itemName: string, priceLabel: string) => void;
  totalPrice: number;
}

export function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  totalPrice,
}: CartSidebarProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();

  const deliveryFee = 1.5;
  const total = totalPrice + deliveryFee;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega algunos items antes de continuar",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderData = {
        items: cartItems.map((cartItem) => ({
          menuItemId: cartItem.id,
          quantity: cartItem.quantity,
          unitPrice: cartItem.selectedPrice.value,
          priceLabel: cartItem.selectedPrice.label,
        })),
        subtotal: totalPrice,
        deliveryFee,
        total,
      };

      const response = await fetch(`${config.apiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();

      toast({
        title: "¡Orden creada!",
        description: `Tu orden #${order.id} ha sido creada exitosamente`,
      });

      onClose();
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la orden. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold">Tu Carrito</h2>
              <Badge variant="secondary">{cartItems.length}</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((cartItem) => (
                  <Card
                    key={`${cartItem.id}-${cartItem.selectedPrice.label}`}
                    className="p-4"
                  >
                    <div className="flex gap-3">
                      <img
                        src={cartItem.image || "/placeholder.jpg"}
                        alt={cartItem.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{cartItem.name}</h3>
                            <p className="text-sm text-gray-600">
                              ${cartItem.selectedPrice.value.toFixed(2)} -{" "}
                              {cartItem.selectedPrice.label}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              onRemoveItem(
                                cartItem.name,
                                cartItem.selectedPrice.label
                              )
                            }
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onUpdateQuantity(
                                cartItem.name,
                                cartItem.selectedPrice.label,
                                cartItem.quantity - 1
                              )
                            }
                            disabled={cartItem.quantity <= 1}
                            className="h-6 w-6 p-0"
                          >
                            -
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {cartItem.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              onUpdateQuantity(
                                cartItem.name,
                                cartItem.selectedPrice.label,
                                cartItem.quantity + 1
                              )
                            }
                            className="h-6 w-6 p-0"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {isCheckingOut ? "Procesando..." : "Finalizar Pedido"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
