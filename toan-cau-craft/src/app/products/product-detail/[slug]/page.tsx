import React from "react";
import { MainLayout } from "@/components";
import { ProductDetail } from "@/screens";
export default function ProductsDetailPage({ params }: { params: { slug: string } }) {
  
  return (
    <main>
      <MainLayout>
        <ProductDetail slug={params.slug}/>
      </MainLayout>
    </main>
  );
}
