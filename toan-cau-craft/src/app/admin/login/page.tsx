"use client"
import React from "react";
import AdminLogin from "@/screens/adminLogin";
import { MainLayout } from "@/components";

export default function AdminPage() {
  return (
    <main>
      <MainLayout>
        <AdminLogin />
      </MainLayout>
    </main>
  );
}
