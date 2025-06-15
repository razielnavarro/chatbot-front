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
  const [showFlavorModal, setShowFlavorModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [itemDetails, setItemDetails] = useState<MenuItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  const showAddedToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  const handleAddToCart = (item: MenuItem) => {
    // Check if item has fries option
    const hasFriesOption = item.prices.some(
      (price) => price.label === "Con papas"
    );

    // Check if item is a drink with flavor options
    const isDrinkWithFlavors =
      item.category === "Bebidas" &&
      (item.name === "BATIDOS" || item.name === "LICUADOS");

    if (hasFriesOption) {
      setSelectedItem(item);
      setShowFriesModal(true);
    } else if (isDrinkWithFlavors) {
      setSelectedItem(item);
      setShowFlavorModal(true);
    } else {
      // If no special options, add directly with the only price
      addToCart(item, item.prices[0]);
      showAddedToast();
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
    showAddedToast();
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

  const handleFlavorSelection = (flavor: string) => {
    if (selectedItem) {
      const price = selectedItem.prices.find((p) => p.label === flavor);
      if (price) {
        addToCart(selectedItem, price);
      }
    }
    setShowFlavorModal(false);
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

      {/* Floating Sticky Cart Button */}
      <button
        className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center w-16 h-16 md:w-20 md:h-20 focus:outline-none transition-all"
        aria-label="Ver carrito"
        onClick={() => setShowMobileCart(true)}
        type="button"
      >
        <span className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 md:h-10 md:w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.48 19h9.04a2 2 0 001.83-1.3L21 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7"
            />
          </svg>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full text-xs font-bold px-2 py-0.5 border border-red-600">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </span>
      </button>

      {/* Sticky Delivery/Pickup Toggle */}
      {/* <div className="sticky top-0 z-30 bg-gray-50 pt-2 pb-3 flex justify-center md:pl-8 border-b border-gray-200">
        <div className="inline-flex rounded-full bg-white shadow-md overflow-hidden">
          <button
            className={`px-6 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
              orderType === "pickup"
                ? "bg-red-600 text-white"
                : "text-gray-700 bg-white hover:bg-gray-100"
            }`}
            onClick={() => setOrderType("pickup")}
            aria-pressed={orderType === "pickup"}
          >
            Pickup
          </button>
          <button
            className={`px-6 py-2 font-semibold transition-colors duration-200 focus:outline-none ${
              orderType === "delivery"
                ? "bg-red-600 text-white"
                : "text-gray-700 bg-white hover:bg-gray-100"
            }`}
            onClick={() => setOrderType("delivery")}
            aria-pressed={orderType === "delivery"}
          >
            Delivery
          </button>
        </div>
      </div> */}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <MenuGrid
              items={menu}
              onAddToCart={handleAddToCart}
              onShowDetails={(item) => {
                setItemDetails(item);
                setShowItemDetails(true);
              }}
            />
          </div>

          {/* Cart Sidebar - Takes 1 column on desktop, full width on mobile */}
          <div className="lg:col-span-1">
            <CartSidebar
              items={cartItems}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
              totalPrice={getTotalPrice()}
              show={showMobileCart}
              onClose={() => setShowMobileCart(false)}
            />
          </div>
        </div>
      </div>

      {/* Item Details Modal */}
      {showItemDetails && itemDetails && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setShowItemDetails(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full overflow-hidden flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
              onClick={() => setShowItemDetails(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="relative w-full h-56">
              <img
                src={itemDetails.image}
                alt={itemDetails.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-2xl font-bold mb-2">{itemDetails.name}</h2>
              <p className="text-gray-700 mb-4">{itemDetails.description}</p>
              <div className="mb-4">
                {itemDetails.prices.map((price) => (
                  <div
                    key={price.label}
                    className="flex justify-between items-center mb-1"
                  >
                    <span className="font-medium text-gray-800">
                      {price.label || "Precio"}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${price.value.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-auto">
                <button
                  onClick={() => {
                    setShowItemDetails(false);
                    handleAddToCart(itemDetails);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center py-3 rounded-lg text-lg font-semibold"
                >
                  <span className="block md:hidden mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.48 19h9.04a2 2 0 001.83-1.3L21 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7"
                      />
                    </svg>
                  </span>
                  <span className="hidden md:flex items-center justify-center w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A2 2 0 007.48 19h9.04a2 2 0 001.83-1.3L21 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7"
                      />
                    </svg>
                    Agregar al carrito
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fries Combo Modal */}
      {showFriesModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowFriesModal(false);
            setSelectedItem(null);
          }}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
              onClick={() => {
                setShowFriesModal(false);
                setSelectedItem(null);
              }}
              aria-label="Cerrar"
            >
              ×
            </button>
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

      {/* Flavor Selection Modal */}
      {showFlavorModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowFlavorModal(false);
            setSelectedItem(null);
          }}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
              onClick={() => {
                setShowFlavorModal(false);
                setSelectedItem(null);
              }}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">Selecciona el sabor</h3>
            <p className="mb-4">{selectedItem.name}</p>
            <div className="grid grid-cols-1 gap-3">
              {selectedItem.prices.map((price) => (
                <button
                  key={price.label}
                  onClick={() => handleFlavorSelection(price.label)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 flex justify-between items-center"
                >
                  <span>{price.label}</span>
                  <span>${price.value.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg text-base font-semibold animate-fade-in-out">
          Agregado al carrito correctamente
        </div>
      )}
    </div>
  );
}
