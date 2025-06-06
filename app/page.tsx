"use client"

import { useState } from "react"
import { MenuGrid } from "@/components/menu-grid"
import { CartSidebar } from "@/components/cart-sidebar"
import { Header } from "@/components/header"

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface CartItem extends MenuItem {
  quantity: number
}

// Mock menu data - in a real app, this would come from an API
const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Martes Locos 6 Presas",
    description: "6 piezas de pollo crujiente con nuestra receta secreta de 11 hierbas y especias",
    price: 6.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Promociones",
  },
  {
    id: "2",
    name: "Martes Locos Paquete 6 Presas",
    description: "6 piezas de pollo + 3 acompañamientos regulares + 3 pasteles",
    price: 13.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Promociones",
  },
  {
    id: "3",
    name: "Martes Locos 8 Presas",
    description: "8 piezas de pollo crujiente perfecto para compartir",
    price: 8.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Promociones",
  },
  {
    id: "4",
    name: "Martes Locos Paquete 8 Presas",
    description: "8 piezas de pollo + 4 acompañamientos regulares + 4 pasteles",
    price: 16.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Promociones",
  },
  {
    id: "5",
    name: "Combo Kentucky BBQ Bacon",
    description: "Hamburguesa BBQ Bacon + papas regulares + bebida regular",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Combos",
  },
  {
    id: "6",
    name: "Big Box Kentucky BBQ Bacon",
    description: "Hamburguesa BBQ Bacon + 2 presas + papas + bebida + postre",
    price: 15.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Combos",
  },
  {
    id: "7",
    name: "Pack Kentucky BBQ Bacon",
    description: "2 Hamburguesas BBQ Bacon + 2 papas regulares + 2 bebidas",
    price: 22.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Combos",
  },
  {
    id: "8",
    name: "Un Bucket Sorprendente",
    description: "Bucket con variedad de productos KFC para toda la familia",
    price: 18.99,
    image: "/placeholder.svg?height=200&width=300",
    category: "Buckets",
  },
]

export default function RestaurantMenu() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemsCount={cartItems.reduce((total, item) => total + item.quantity, 0)} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <MenuGrid items={menuItems} onAddToCart={addToCart} />
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
    </div>
  )
}
