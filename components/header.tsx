import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick?: () => void;
}

export function Header({ cartItemsCount, onCartClick }: HeaderProps) {
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
            <button
              className="relative focus:outline-none"
              aria-label="Ver carrito"
              onClick={onCartClick}
              type="button"
            ></button>
          </div>
        </div>
      </div>
    </header>
  );
}
