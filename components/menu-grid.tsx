import type { MenuItem } from "@/app/page"
import { MenuItemCard } from "./menu-item-card"

interface MenuGridProps {
  items: MenuItem[]
  onAddToCart: (item: MenuItem) => void
}

export function MenuGrid({ items, onAddToCart }: MenuGridProps) {
  const categories = Array.from(new Set(items.map((item) => item.category)))

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <section key={category}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items
              .filter((item) => item.category === category)
              .map((item) => (
                <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
