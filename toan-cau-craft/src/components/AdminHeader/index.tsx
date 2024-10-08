"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { latoRegular, leagueSpartanRegular } from "@/fonts";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

type HeaderProp = {
  className?: string;
};

const navLinks = [
  { id: 1, name: "Cài đặt chung", path: "/admin", expandable: false },
  { id: 2, name: "Sản phẩm", path: "/admin/products", expandable: true },
  {
    id: 3,
    name: "Phân loại 1 (Category)",
    path: "/admin/category",
    expandable: false,
  },
  {
    id: 4,
    name: "Phân loại 2 (Type)",
    path: "/admin/type",
    expandable: false,
  },
];

export const AdminHeader = ({ className }: HeaderProp): React.JSX.Element => {
  const pathname = usePathname();
  const isActive = (path: string) => path === pathname;

  return (
    <div
      className={twMerge(
        "relative justify-center items-center h-full rounded-lg",
        className
      )}
    >
      <div className="flex flex-col items-start bg-secondary-50 h-full rounded-lg">
        <div className="flex gap-2 p-3 bg-primary-200 rounded-xl">
          <Image
            src="/images/logo.svg"
            className="size-9"
            width={200}
            height={200}
            alt="logo"
          />
          <p
            className={twMerge(
              "text-xl text-textPrimary",
              latoRegular.className
            )}
          >
            Craft toàn cầu - trang quản trị
          </p>
        </div>
        <div className="flex flex-col w-full">
          {navLinks.map((item, index) => (
            <HeaderLink
              key={index}
              title={item.name}
              isCurrent={isActive(item.path)}
              href={item.path}
              expandable={item.expandable}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HeaderLink = ({
  href,
  title,
  isCurrent,
}: {
  href: string;
  title: string;
  isCurrent?: boolean;
  expandable?: boolean;
}) => {
  return (
    <Link
      className={twMerge(
        "p-5 text-textSecondary flex items-center",
        isCurrent
          ? " border-b text-textPrimary bg-primary-100"
          : "text-textSecondary"
      )}
      href={href}
    >
      <p className={leagueSpartanRegular.className}>{title}</p>
    </Link>
  );
};
