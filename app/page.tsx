import { Suspense } from "react";
import MenuPageClient from "./menuPageClient";

export default function RestaurantMenu() {
  return (
    <Suspense fallback={<div>Cargando menú...</div>}>
      <MenuPageClient />
    </Suspense>
  );
}
