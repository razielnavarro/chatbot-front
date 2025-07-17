import type { MenuItem } from "@/app/menuPageClient";
import { MenuItemCard } from "./menu-item-card";

interface MenuGridProps {
  items: {
    name: string;
    items: MenuItem[];
  }[];
  onAddToCart: (item: MenuItem) => void;
  onShowDetails: (item: MenuItem) => void;
}

export function MenuGrid({ items, onAddToCart, onShowDetails }: MenuGridProps) {
  return (
    <div className="space-y-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {items.map((category) => (
        <section key={category.name} className="relative">
          {/* Category Header with decorative line */}
          <div className="flex items-center mb-8">
            <div className="flex-grow">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 uppercase tracking-wide">
                {category.name}
              </h2>
              <div className="w-16 h-1 bg-red-600 mt-2 rounded-full"></div>
            </div>
          </div>

          {/* Responsive Grid with consistent card heights */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {category.items.map((item) => (
              <MenuItemCard
                key={item.name}
                item={item}
                onAddToCart={onAddToCart}
                onShowDetails={onShowDetails}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
