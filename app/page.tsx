"use client";

import { useState } from "react";
import { MenuGrid } from "@/components/menu-grid";
import { CartSidebar } from "@/components/cart-sidebar";
import { Header } from "@/components/header";
import { menu } from "@/data/menu-data";

export interface MenuItemPrice {
  label: string;
  value: number;
}

export interface MenuItem {
  name: string;
  description: string;
  prices: MenuItemPrice[];
  category: string;
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedPrice: MenuItemPrice;
}

export default function RestaurantMenu() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showFriesModal, setShowFriesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleAddToCart = (item: MenuItem) => {
    // Check if item has fries option
    const hasFriesOption = item.prices.some(
      (price) => price.label === "Con papas"
    );

    if (hasFriesOption) {
      setSelectedItem(item);
      setShowFriesModal(true);
    } else {
      // If no fries option, add directly with the only price
      addToCart(item, item.prices[0]);
    }
  };

  const addToCart = (item: MenuItem, selectedPrice: MenuItemPrice) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (cartItem) =>
          cartItem.name === item.name &&
          cartItem.selectedPrice.label === selectedPrice.label
      );
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.name === item.name &&
          cartItem.selectedPrice.label === selectedPrice.label
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1, selectedPrice }];
    });
  };

  const removeFromCart = (itemName: string, priceLabel: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.name === itemName && item.selectedPrice.label === priceLabel)
      )
    );
  };

  const updateQuantity = (
    itemName: string,
    priceLabel: string,
    quantity: number
  ) => {
    if (quantity === 0) {
      removeFromCart(itemName, priceLabel);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.name === itemName && item.selectedPrice.label === priceLabel
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.selectedPrice.value * item.quantity,
      0
    );
  };

  const handleFriesSelection = (withFries: boolean) => {
    if (selectedItem) {
      const price = withFries
        ? selectedItem.prices.find((p) => p.label === "Con papas")
        : selectedItem.prices.find((p) => p.label === "Sola");

      if (price) {
        addToCart(selectedItem, price);
      }
    }
    setShowFriesModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemsCount={cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        )}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <MenuGrid items={menu} onAddToCart={handleAddToCart} />
          </div>

          {/* Cart Sidebar - Takes 1 column on desktop, full width on mobile */}
          <div className="lg:col-span-1">
            <CartSidebar
              items={cartItems}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
              totalPrice={getTotalPrice()}
            />
          </div>
        </div>
      </div>

      {/* Fries Combo Modal */}
      {showFriesModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              ¿Deseas agregar papas fritas?
            </h3>
            <p className="mb-4">
              {selectedItem.name} - {selectedItem.description}
            </p>
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-semibold">Sin papas</p>
                <p className="text-gray-600">
                  $
                  {selectedItem.prices
                    .find((p) => p.label === "Sola")
                    ?.value.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="font-semibold">Con papas</p>
                <p className="text-gray-600">
                  $
                  {selectedItem.prices
                    .find((p) => p.label === "Con papas")
                    ?.value.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleFriesSelection(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
              >
                Sin papas
              </button>
              <button
                onClick={() => handleFriesSelection(true)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Con papas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
