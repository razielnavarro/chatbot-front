import type { MenuItem } from "@/app/page";
import { MenuItemCard } from "./menu-item-card";

interface MenuGridProps {
  items: {
    name: string;
    items: MenuItem[];
  }[];
  onAddToCart: (item: MenuItem) => void;
}

export function MenuGrid({ items, onAddToCart }: MenuGridProps) {
  return (
    <div className="space-y-8">
      {items.map((category) => (
        <section key={category.name}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            {category.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.items.map((item) => (
              <MenuItemCard
                key={item.name}
                item={item}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
