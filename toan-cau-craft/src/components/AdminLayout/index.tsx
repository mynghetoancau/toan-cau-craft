"use client"
import React, { useEffect } from "react";
import { AdminHeader } from "../AdminHeader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

type MainLayoutProp = {
  children: React.ReactNode;
};

export const AdminLayout = ({
  children,
}: MainLayoutProp): React.JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user) {
      const userInfo = JSON.parse(user);
      if (!(userInfo?.role === "admin")) {
        toast.error("Bạn không có quyền truy cập!");
        router.push("/admin/login");
      }
    } else {
      toast.error("Bạn không có quyền truy cập!");
      router.push("/admin/login");
    }

  }, [])

  return (
    <div className="w-full fixed-container grid grid-cols-6 bg-themeWhite h-screen">
      <AdminHeader className="col-span-1 bg-secondary-50" />
      <div className="col-span-5">{children}</div>
    </div>
  );
};
