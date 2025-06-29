"use client";

import Image from "next/image";
import type { MenuItem } from "@/app/menuPageClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
      <div onClick={() => onShowDetails(item)}>
        <div className="relative h-40 w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
            {item.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-1">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ${basePrice.toFixed(2)}
              </span>
              {hasFriesOption && (
                <span className="text-sm text-gray-500 ml-2">
                  + papas disponibles
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(item);
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
          size="lg"
        >
          <span className="block md:hidden mx-auto">
            <ShoppingCart className="w-5 h-5" />
          </span>
          <span className="hidden md:flex items-center justify-center w-full">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Agregar al carrito
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
