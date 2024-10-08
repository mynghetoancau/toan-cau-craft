"use client"
import Image from "next/image";
import { TopBanner } from "../../components/TopBanner";
import { MainInfoCard } from "./MainInfoCard";
import { twMerge } from "tailwind-merge";
import { cormorantRegular, latoRegular } from "@/fonts";
import { CategoryCard } from "@/components/CategoryCard";
import { ButtonApp } from "@/components";
import { ProductCard } from "@/components/ProductCard";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { getBannerByType } from "@/models/Banner";

export const Home = (): React.JSX.Element => {
  const router = useRouter();
  const categories = useAppSelector((state) => state.category);
  const [banner, setBanner] = useState();
  const getBanner = async () => {
    const data = await getBannerByType('home') as any;
    setBanner(data?.data?.url || "/images/home-bg.png"); 
  }

  useEffect(() => {
    getBanner();
  }, [])

  return (
    <div>
      <TopBanner
        src={banner || "/images/home-bg.png"}
        h1="Handicraft"
        h2="MADE WITH LOVE"
        description="Lorem ipsum dolor sit amet consectetur. Tempor faucibus sit iaculis arcu felis. Volutpat sollicitudin tortor aliquam maecenas porttitor ac et blandit. Pretium urna at ac purus aliquet mauris. Sit feugiat mattis turpis congue justo."
      />

      <div className="flex justify-center -translate-y-10">
        <MainInfoCard />
      </div>

      <div className="flex flex-col text-4xl m-4 sm:m-24">
        <h3
          className={twMerge(
            cormorantRegular.className,
            "text-textPrimary text-center"
          )}
        >
          CATEGORY
        </h3>
        <div className="w-full mt-10">
          <div className="grid sm:grid-cols-2">
            {
              categories?.length > 0 && categories.slice(0,2).map((category) => (
                <CategoryCard
                  onClick={() => {
                    router.push("products");
                  }}
                  className="col-span-1 m-4"
                  src={category.image}
                  title={category.name}
                />
              ))
            }
          </div>
          <div className="grid sm:grid-cols-3">
          {
              categories?.length > 0 && categories.slice(2, 8).map((category) => (
                <CategoryCard
                  onClick={() => {
                    router.push("products");
                  }}
                  className="col-span-1 m-4"
                  src={category.image}
                  title={category.name}
                />
              ))
            }
          </div>
        </div>
      </div>

      <div className="sm:h-96 m-5 sm:m-24">
        <div className="grid sm:grid-cols-2 gap-16">
          <div className="col-span-1">
            <div className="mt-8">
              <h1 className="text-textPrimary font-island-moments text-4xl">
                Explore
              </h1>
              <h2
                className={twMerge(
                  cormorantRegular.className,
                  "text-textPrimary text-4xl"
                )}
              >
                ART FROM NATURE
              </h2>
              <p
                className={twMerge(
                  latoRegular.className,
                  "max-w-screen-sm mt-6 text-textSecondary"
                )}
              >
                Lorem ipsum dolor sit amet consectetur. Tempor faucibus sit
                iaculis arcu felis. Volutpat sollicitudin tortor aliquam
                maecenas porttitor ac et blandit. Pretium urna at ac purus
                aliquet mauris. Sit feugiat mattis turpis congue justo. Lorem
                ipsum dolor sit amet consectetur. Tempor faucibus sit iaculis
                arcu felis. Volutpat sollicitudin tortor aliquam maecenas
                porttitor ac et blandit. Pretium urna at ac purus aliquet
                mauris. Sit feugiat mattis turpis congue justo.
              </p>
              <ButtonApp className="mt-9" title="VIEW PRODUCTS" handleNavigate={() => {
                router.push("products");
              }} />
            </div>
          </div>
          <div className="col-span-1 sm:h-96">
            <div className="relative w-full h-96 sm:h-full">
              <Image
                fill
                objectFit="contain"
                src={"/images/demo-product-link.png"}
                alt="product_link_image"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col text-4xl sm:m-24">
        <h3
          className={twMerge(
            cormorantRegular.className,
            "text-textPrimary text-center"
          )}
        >
          NEW COLLECTION
        </h3>
        <div className="w-full mt-10">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            <ProductCard
              onClick={() => {
                router.push("products/product-detail/demo-product-1");
              }}
              className="col-span-1 sm:m-4"
              src="/images/demo_product_1.png"
              name="Olpe"
              category="Ceramic"
            />
            <ProductCard
              onClick={() => {
                router.push("products/product-detail/demo-product-1");
              }}
              className="col-span-1 sm:m-4"
              src="/images/demo_product_2.png"
              name="Olpe"
              category="Ceramic"
            />
            <ProductCard
              onClick={() => {
                router.push("products/product-detail/demo-product-1");
              }}
              className="col-span-1 sm:m-4"
              src="/images/demo_product_3.png"
              name="Olpe"
              category="Ceramic"
            />
            <ProductCard
              onClick={() => {
                router.push("products/product-detail/demo-product-1");
              }}
              className="col-span-1 sm:m-4"
              src="/images/demo_product_4.png"
              name="Olpe"
              category="Ceramic"
            />
            <ProductCard
              onClick={() => {
                router.push("products/product-detail/demo-product-1");
              }}
              className="col-span-1 sm:m-4"
              src="/images/demo_product_5.png"
              name="Olpe"
              category="Ceramic"
            />
            <ProductCard
              onClick={() => {
                router.push("products/product-detail/demo-product-1");
              }}
              className="col-span-1 sm:m-4"
              src="/images/demo_product_6.png"
              name="Olpe"
              category="Ceramic"
            />
            <ProductCard
              onClick={() => {
                router.push("products/product-detail/demo-product-1");
              }}
              className="col-span-1 sm:m-4"
              src="/images/demo_product_7.png"
              name="Olpe"
              category="Ceramic"
            />
            <ProductCard
              onClick={() => {
                router.push("products/product-detail/demo-product-1");
              }}
              className="col-span-1 sm:m-4"
              src="/images/demo_product_8.png"
              name="Olpe"
              category="Ceramic"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
