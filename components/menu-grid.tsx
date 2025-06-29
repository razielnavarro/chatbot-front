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
    <div className="space-y-8 px-2 sm:px-4 md:px-0">
      {items.map((category) => (
        <section key={category.name}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            {category.name}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
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
