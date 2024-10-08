import React, { Suspense } from "react";
import { MainLayout } from "@/components";
import { Products } from "@/screens";
export default function ProductsPage() {
  return (
    <main>
      <MainLayout>
        <Suspense>
          <Products />
        </Suspense>
      </MainLayout>
    </main>
  );
}
