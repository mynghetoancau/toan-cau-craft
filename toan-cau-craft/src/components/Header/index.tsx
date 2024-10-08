"use client";
import { Icons } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SearchBox } from "../SearchBox";
import { leagueSpartanRegular } from "@/fonts";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Category, fetchCategories } from "@/models/Category";
import { fetchTypes, Type } from "@/models/Type";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCategories } from "@/store/categoryState";
import { Menu, MenuIcon } from "lucide-react";

const navLinks = [
  { id: 1, name: "HOME", path: "/", expandable: false },
  { id: 2, name: "PRODUCTS", path: "/products", expandable: true },
  { id: 3, name: "ABOUT US", path: "/about-us", expandable: false },
  { id: 4, name: "CONTACT US", path: "/contact-us", expandable: false },
];

export const Header = (): React.JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => path === pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative justify-center grid grid-cols-2 h-16 bg-white items-center sm:flex sm:justify-between">
      <div className="flex items-center">
        <div className="ml-3 flex gap-3">
          <button
            className="sm:hidden ml-3 text-themeDark"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
          >
            <MenuIcon />
          </button>
          <Image
            src="/images/logo.svg"
            className="size-9"
            width={200}
            height={200}
            alt="logo"
          />
        </div>
        <div className="hidden sm:flex ml-28">
          {navLinks.map((item, index: number) => (
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
      <div className="flex items-center">
        <SearchBox
          className="w-96"
          onSubmit={(keys) => router.push(`/products?name=${keys}`)}
        />
        {/* Hamburger Icon for Mobile Menu */}
        {/* <button
          className="sm:hidden ml-3"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
        >
          <Image alt="menu" src={Icons.ChevronDown} />
        </button> */}
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50 sm:hidden bg-anitiqueWhite text-textPrimary ">
          <div className="flex flex-col items-center">
            {navLinks.map((item, index: number) => (
              <HeaderLink
                key={index}
                title={item.name}
                isCurrent={isActive(item.path)}
                href={item.path}
                expandable={item.expandable}
                isMobileMenuOpen={isMobileMenuOpen}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HeaderLink = ({
  href,
  title,
  isCurrent,
  expandable = false,
  isMobileMenuOpen = false
}: {
  href: string;
  title: string;
  isCurrent?: boolean;
  expandable?: boolean;
  isMobileMenuOpen?: boolean;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [types, setTypes] = useState<Type[]>([]);
  const categories = useAppSelector((state) => state.category);

  const getCategory = async () => {
    if (categories.length === 0) {
      const fetchCategory = await fetchCategories();
      dispatch(setCategories(fetchCategory));
    }

    const fetchType = await fetchTypes();
    setTypes(fetchType);
  };

  useEffect(() => {
    if (title === "PRODUCTS") {
      getCategory();
    }
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => expandable && setIsDropdownOpen(true)}
      onMouseLeave={() => expandable && setIsDropdownOpen(false)}
    >
      <Link
        className={twMerge(
          "m-5 text-textSecondary flex items-center",
          isCurrent ? "border-b text-textPrimary" : "text-textSecondary"
        )}
        href={href}
      >
        <p className="font-league-spartan-regular">{title}</p>
        {expandable && !isMobileMenuOpen && (
          <Image alt="chevron down" src={Icons.ChevronDown} />
        )}
      </Link>

      {expandable && !isMobileMenuOpen && isDropdownOpen && categories?.length > 0 && (
        <div className="absolute transition left-0 w-96 min-h-128 bg-anitiqueWhite text-textPrimary rounded-md shadow-lg z-[999] flex flex-wrap">
          <ul className="py-1 w-1/2">
            <div className="text-center">Category</div>
            {categories.map((category) => (
              <li
                key={category.id}
                className="px-4 py-2 hover:bg-blurEffectGold transition cursor-pointer"
                onClick={() => {
                  router.push(`products?category=${category.id}`);
                }}
              >
                <div>{category.name}</div>
              </li>
            ))}
          </ul>
          <ul className="py-1 w-1/2">
            <div className="text-center">Type</div>
            {types.map((type) => (
              <li
                key={type.id}
                className="px-4 py-2 hover:bg-blurEffectGold transition cursor-pointer"
                onClick={() => {
                  router.push(`products?type=${type.id}`);
                }}
              >
                <div>{type.name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

