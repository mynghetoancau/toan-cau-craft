"use client"
import React from "react";
import { AdminLayout } from "@/components";
import { Admin } from "@/screens";

export default function AdminPage() {
  return (
    <main>
      <AdminLayout>
        <Admin />
      </AdminLayout>
    </main>
  );
}
