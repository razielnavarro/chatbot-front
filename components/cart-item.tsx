"use client";

import type { CartItem } from "@/app/menuPageClient";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export function CartItemComponent({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
          {item.name}
        </h4>
        <p className="text-sm text-gray-600 mt-1">
          ${item.selectedPrice.value.toFixed(2)}{" "}
          {item.selectedPrice.label && `(${item.selectedPrice.label})`}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">
              ${(item.selectedPrice.value * item.quantity).toFixed(2)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={onRemove}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
