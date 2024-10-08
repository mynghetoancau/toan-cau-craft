"use client"
import React from "react";
import { AdminLayout} from "@/components";
import { AdminProductUpdate } from "@/screens/adminProductUpdate";

export default function AdminPage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <AdminLayout>
        <AdminProductUpdate slug={params.slug}/>
      </AdminLayout>
    </main>
  );
}
