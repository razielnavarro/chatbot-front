"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MenuPageLayout } from "@/components/menu-page-layout";
import { CartSidebar } from "@/components/cart-sidebar";
import { menu } from "@/data/menu-data";
import { ShoppingCart } from "lucide-react";
import { Header } from "@/components/header";
import PromoBanner from "@/components/promo-banner";
import type { PromoData } from "@/components/promo-banner";
import PromoUnavailableToast from "@/components/promo-unavailable-toast";

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

export default function MenuPageClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showFriesModal, setShowFriesModal] = useState(false);
  const [showFlavorModal, setShowFlavorModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [itemDetails, setItemDetails] = useState<MenuItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const resumeUrl = searchParams.get("resumeUrl");
  const [showPromoUnavailableToast, setShowPromoUnavailableToast] =
    useState(false);
  const [promoUnavailableMessage, setPromoUnavailableMessage] = useState("");

  // Handler for unavailable promo
  const handlePromoUnavailable = (nextDay: string) => {
    setPromoUnavailableMessage(
      `Esta promoción estará disponible ${nextDay.toLowerCase()}, te esperamos pronto`
    );
    setShowPromoUnavailableToast(true);
  };

  const showAddedToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  const handleAddToCart = (item: MenuItem) => {
    const hasFriesOption = item.prices.some(
      (price) => price.label === "Con papas"
    );
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

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    try {
      const payload = {
        order_id: orderId,
        items: cartItems,
        total: getTotalPrice(),
        source: "whatsapp_ordering_system",
      };
      const endpoint =
        resumeUrl ||
        process.env.NEXT_PUBLIC_N8N_MENU_WEBHOOK_URL ||
        "https://your-n8n-instance.com/webhook/menu-checkout";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      alert("Pedido enviado correctamente");
      setCartItems([]);
      setShowMobileCart(false);
    } catch (error) {
      alert("Error al enviar el pedido. Por favor, inténtalo de nuevo.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Handler for promo click
  const handlePromoClick = (promo: PromoData) => {
    // Map PromoData to MenuItem structure
    const promoItem = {
      name: promo.name,
      description: promo.description,
      prices: promo.prices,
      image: promo.image,
      category: "Promociones", // default category
    };
    setItemDetails(promoItem);
    setShowItemDetails(true);
  };

  return (
    <>
      <Header cartItemsCount={cartItems.length} />
      <PromoBanner
        onPromoClick={handlePromoClick}
        onPromoUnavailable={handlePromoUnavailable}
      />
      <PromoUnavailableToast
        show={showPromoUnavailableToast}
        message={promoUnavailableMessage}
        onClose={() => setShowPromoUnavailableToast(false)}
      />
      <MenuPageLayout
        items={menu}
        onAddToCart={handleAddToCart}
        onShowDetails={(item) => {
          setItemDetails(item);
          setShowItemDetails(true);
        }}
      />

      {/* Enhanced Floating Cart Button */}
      <button
        className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center w-16 h-16 md:w-20 md:h-20 focus:outline-none transition-all hover:shadow-xl active:scale-95"
        aria-label="Ver carrito"
        onClick={() => setShowMobileCart(true)}
        type="button"
      >
        <span className="relative">
          <ShoppingCart className="h-8 w-8 md:h-10 md:w-10" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full text-xs font-bold px-2 py-0.5 border border-red-600 min-w-[1.5rem] h-6 flex items-center justify-center">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </span>
      </button>

      {/* Cart Sidebar */}
      <CartSidebar
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        totalPrice={getTotalPrice()}
        show={showMobileCart}
        onClose={() => setShowMobileCart(false)}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
      />

      {/* Enhanced Item Details Modal */}
      {showItemDetails && itemDetails && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowItemDetails(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm"
              onClick={() => setShowItemDetails(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="relative w-full h-56">
              <img
                src={itemDetails.image || "/placeholder.svg"}
                alt={itemDetails.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                {itemDetails.name}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {itemDetails.description}
              </p>
              <div className="mb-6 space-y-2">
                {itemDetails.prices.map((price) => (
                  <div
                    key={price.label}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-medium text-gray-700">
                      {price.label || "Precio"}
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      ${price.value.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowItemDetails(false);
                  handleAddToCart(itemDetails);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-lg active:scale-95"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Fries Selection Modal */}
      {showFriesModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowFriesModal(false);
            setSelectedItem(null);
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
              onClick={() => {
                setShowFriesModal(false);
                setSelectedItem(null);
              }}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              ¿Deseas agregar papas fritas?
            </h3>
            <p className="mb-6 text-gray-600">
              {selectedItem.name} - {selectedItem.description}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <p className="font-semibold text-gray-900 mb-1">Sin papas</p>
                <p className="text-2xl font-bold text-red-600">
                  $
                  {selectedItem.prices
                    .find((p) => p.label === "Sola")
                    ?.value.toFixed(2)}
                </p>
              </div>
              <div className="text-center p-4 border border-red-200 bg-red-50 rounded-xl">
                <p className="font-semibold text-gray-900 mb-1">Con papas</p>
                <p className="text-2xl font-bold text-red-600">
                  $
                  {selectedItem.prices
                    .find((p) => p.label === "Con papas")
                    ?.value.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleFriesSelection(false)}
                className="py-3 px-4 bg-gray-100 text-gray-800 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Sin papas
              </button>
              <button
                onClick={() => handleFriesSelection(true)}
                className="py-3 px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Con papas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Flavor Selection Modal */}
      {showFlavorModal && selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowFlavorModal(false);
            setSelectedItem(null);
          }}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
              onClick={() => {
                setShowFlavorModal(false);
                setSelectedItem(null);
              }}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Selecciona el sabor
            </h3>
            <p className="mb-6 text-gray-600">{selectedItem.name}</p>
            <div className="space-y-3">
              {selectedItem.prices.map((price) => (
                <button
                  key={price.label}
                  onClick={() => handleFlavorSelection(price.label)}
                  className="w-full bg-red-600 text-white py-4 px-4 rounded-xl hover:bg-red-700 flex justify-between items-center font-semibold transition-colors"
                >
                  <span>{price.label}</span>
                  <span>${price.value.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg text-base font-semibold animate-fade-in-out flex items-center">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-3">
            <span className="text-green-600 text-sm">✓</span>
          </div>
          Agregado al carrito correctamente
        </div>
      )}
    </>
  );
}
