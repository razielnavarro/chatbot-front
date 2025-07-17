"use client";

import Image from "next/image";
import type { MenuItem } from "@/app/menuPageClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Plus } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onShowDetails: (item: MenuItem) => void;
}

export function MenuItemCard({
  item,
  onAddToCart,
  onShowDetails,
}: MenuItemCardProps) {
  const basePrice = item.prices[0].value;
  const hasFriesOption = item.prices.some(
    (price) => price.label === "Con papas"
  );

  return (
    <Card className="group relative overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-0 ring-1 ring-gray-100 hover:ring-red-200 h-full flex flex-col">
      {/* Image Container with Overlay Effect */}
      <div
        onClick={() => onShowDetails(item)}
        className="relative aspect-square overflow-hidden"
      >
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Add Button - appears on hover */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
            size="sm"
            className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700 shadow-lg backdrop-blur-sm rounded-full w-10 h-10 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Container - Flex grow to push button to bottom */}
      <CardContent
        onClick={() => onShowDetails(item)}
        className="p-4 sm:p-5 flex-grow flex flex-col"
      >
        {/* Title with consistent height */}
        <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 leading-tight min-h-[3.5rem] flex items-start">
          <span className="line-clamp-2">{item.name}</span>
        </h3>

        {/* Description with consistent height */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem] flex-grow">
          {item.description}
        </p>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              ${basePrice.toFixed(2)}
            </span>
            {hasFriesOption && (
              <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">
                + papas
              </span>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer with Add to Cart Button */}
      <CardFooter className="p-4 sm:p-5 pt-0">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:shadow-lg active:scale-95 rounded-lg font-medium"
          size="lg"
        >
          <span className="flex sm:hidden items-center justify-center">
            <ShoppingCart className="w-5 h-5" />
          </span>
          <span className="hidden sm:flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Agregar al carrito
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
