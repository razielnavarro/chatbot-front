import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartItemsCount: number;
}

export function Header({ cartItemsCount }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                <img
                  src="assets/luigi/logo.jpg"
                  className="h-auto w-auto"
                  alt="Logo"
                />
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Menú</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
