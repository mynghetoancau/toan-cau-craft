"use client"
import React from "react";
import { AdminLayout} from "@/components";
import { AdminProducts } from "@/screens";

export default function AdminPage() {
  return (
    <main>
      <AdminLayout>
        <AdminProducts />
      </AdminLayout>
    </main>
  );
}
