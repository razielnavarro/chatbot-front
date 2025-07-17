import { MenuGrid } from "./menu-grid";
import type { MenuItem } from "@/app/menuPageClient";

interface MenuPageLayoutProps {
  items: {
    name: string;
    items: MenuItem[];
  }[];
  onAddToCart: (item: MenuItem) => void;
  onShowDetails: (item: MenuItem) => void;
}

export function MenuPageLayout({
  items,
  onAddToCart,
  onShowDetails,
}: MenuPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8 sm:py-12">
        <MenuGrid
          items={items}
          onAddToCart={onAddToCart}
          onShowDetails={onShowDetails}
        />
      </main>
    </div>
  );
}
