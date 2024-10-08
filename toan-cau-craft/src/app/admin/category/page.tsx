"use client"
import React from "react";
import { AdminLayout } from "@/components";
import { AdminCategory } from "@/screens/adminCategory";

export default function AdminPage() {
  return (
    <main>
      <AdminLayout>
        <AdminCategory />
      </AdminLayout>
    </main>
  );
}
