"use client"
import React from "react";
import { AdminLayout } from "@/components";
import { AdminType } from "@/screens/adminType";

export default function AdminPage() {
  return (
    <main>
      <AdminLayout>
        <AdminType />
      </AdminLayout>
    </main>
  );
}
