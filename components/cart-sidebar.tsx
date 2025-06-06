import type { CartItem } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CartItemComponent } from "./cart-item"
import { ShoppingBag } from "lucide-react"

interface CartSidebarProps {
  items: CartItem[]
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  totalPrice: number
}

export function CartSidebar({ items, onRemoveItem, onUpdateQuantity, totalPrice }: CartSidebarProps) {
  return (
    <Card className="sticky top-6 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <p className="text-sm text-gray-400">Add some delicious items to get started</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onRemove={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
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
            <span className="text-2xl font-bold text-red-600">${totalPrice.toFixed(2)}</span>
          </div>
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
            Proceed to Checkout
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
