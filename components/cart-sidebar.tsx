"use client";

import type { CartItem } from "@/app/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItemComponent } from "./cart-item";
import { ShoppingBag, X } from "lucide-react";
import React, { useState } from "react";
import { useSession } from "@/src/contexts/SessionContext";
import { useRouter } from "next/navigation";

interface CartSidebarProps {
  items: CartItem[];
  onRemoveItem: (itemName: string, priceLabel: string) => void;
  onUpdateQuantity: (
    itemName: string,
    priceLabel: string,
    quantity: number
  ) => void;
  totalPrice: number;
  show?: boolean;
  onClose?: () => void;
}

export function CartSidebar({
  items,
  onRemoveItem,
  onUpdateQuantity,
  totalPrice,
  show = false,
  onClose,
}: CartSidebarProps) {
  const { session } = useSession();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!session?.token) {
      console.error("No session token available");
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              menuItemId: item.id,
              quantity: item.quantity,
              price: item.selectedPrice.value,
            })),
            sessionToken: session.token,
            total: items.reduce(
              (sum, item) => sum + item.selectedPrice.value * item.quantity,
              0
            ),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();
      router.push(`/order/confirmation?orderId=${order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      // Handle error (show error message to user)
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Mobile and desktop modal/drawer
  return (
    <>
      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-40 flex items-end md:hidden transition-all duration-300 ${
          show ? "" : "pointer-events-none opacity-0"
        }`}
        style={{ visibility: show ? "visible" : "hidden" }}
        onClick={onClose}
      >
        <div
          className={`bg-white w-full rounded-t-2xl shadow-lg max-h-[90vh] overflow-y-auto relative p-2 pt-8 transition-transform duration-300 ${
            show ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Resumen del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
                <p className="text-sm text-gray-400">
                  Agrega algunos deliciosos items para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <CartItemComponent
                    key={`${item.name}-${item.selectedPrice.label}`}
                    item={item}
                    onRemove={() =>
                      onRemoveItem(item.name, item.selectedPrice.label)
                    }
                    onUpdateQuantity={(quantity) =>
                      onUpdateQuantity(
                        item.name,
                        item.selectedPrice.label,
                        quantity
                      )
                    }
                  />
                ))}
              </div>
            )}
          </CardContent>
          {items.length > 0 && (
            <CardFooter className="flex-col space-y-4">
              <Separator />
              <div className="flex justify-between items-center w-full">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-red-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
                onClick={handleCheckout}
                disabled={items.length === 0 || isCheckingOut}
              >
                {isCheckingOut ? "Procesando..." : "Realizar pedido"}
              </Button>
            </CardFooter>
          )}
        </div>
      </div>
      {/* Desktop Drawer/Modal (triggered by floating button) */}
      <div
        className={`hidden md:fixed md:inset-0 md:z-50 md:bg-black md:bg-opacity-40 md:flex md:items-center md:justify-end transition-all duration-300 ${
          show
            ? "md:pointer-events-auto md:opacity-100"
            : "md:pointer-events-none md:opacity-0"
        }`}
        style={{ visibility: show ? "visible" : "hidden" }}
        onClick={onClose}
      >
        <div
          className={`bg-white w-full max-w-md h-full shadow-lg overflow-y-auto relative p-2 pt-8 transition-transform duration-300 md:rounded-l-2xl ${
            show ? "md:translate-x-0" : "md:translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Resumen del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
                <p className="text-sm text-gray-400">
                  Agrega algunos deliciosos items para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <CartItemComponent
                    key={`${item.name}-${item.selectedPrice.label}`}
                    item={item}
                    onRemove={() =>
                      onRemoveItem(item.name, item.selectedPrice.label)
                    }
                    onUpdateQuantity={(quantity) =>
                      onUpdateQuantity(
                        item.name,
                        item.selectedPrice.label,
                        quantity
                      )
                    }
                  />
                ))}
              </div>
            )}
          </CardContent>
          {items.length > 0 && (
            <CardFooter className="flex-col space-y-4">
              <Separator />
              <div className="flex justify-between items-center w-full">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-red-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
                onClick={handleCheckout}
                disabled={items.length === 0 || isCheckingOut}
              >
                {isCheckingOut ? "Procesando..." : "Realizar pedido"}
              </Button>
            </CardFooter>
          )}
        </div>
      </div>
      {/* Desktop Static Sidebar (always visible) */}
      <div className="hidden md:block">
        <Card className="sticky top-6 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Resumen del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
                <p className="text-sm text-gray-400">
                  Agrega algunos deliciosos items para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <CartItemComponent
                    key={`${item.name}-${item.selectedPrice.label}`}
                    item={item}
                    onRemove={() =>
                      onRemoveItem(item.name, item.selectedPrice.label)
                    }
                    onUpdateQuantity={(quantity) =>
                      onUpdateQuantity(
                        item.name,
                        item.selectedPrice.label,
                        quantity
                      )
                    }
                  />
                ))}
              </div>
            )}
          </CardContent>
          {items.length > 0 && (
            <CardFooter className="flex-col space-y-4">
              <Separator />
              <div className="flex justify-between items-center w-full">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-red-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
                onClick={handleCheckout}
                disabled={items.length === 0 || isCheckingOut}
              >
                {isCheckingOut ? "Procesando..." : "Realizar pedido"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </>
  );
}
