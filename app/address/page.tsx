import { Suspense } from "react";
import AddressPageClient from "./adressPageClient";

export default function AddressPage() {
  return (
    <Suspense fallback={<div>Cargando dirección...</div>}>
      <AddressPageClient />
    </Suspense>
  );
}
