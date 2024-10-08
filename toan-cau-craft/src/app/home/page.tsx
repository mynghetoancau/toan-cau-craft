import React from "react";
import { MainLayout } from "@/components";
import { Home } from "@/screens";

export default function HomePage() {
  return (
    <main>
      <MainLayout>
        <Home />
      </MainLayout>
    </main>
  );
}
