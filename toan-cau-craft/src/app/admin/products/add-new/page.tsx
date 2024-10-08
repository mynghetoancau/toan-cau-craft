"use client"
import React from "react";
import { AdminLayout} from "@/components";
import { AdminProductAddNew} from "@/screens";

export default function AdminPage() {
  return (
    <main>
      <AdminLayout>
        <AdminProductAddNew />
      </AdminLayout>
    </main>
  );
}
