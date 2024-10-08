"use client";
import {
  cormorantMedium,
  cormorantRegular,
  latoBold,
  latoRegular,
} from "@/fonts";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ProductCard } from "@/components/ProductCard";
import { useRouter } from "next/navigation";
import { fetchProductBySlug, fetchProducts, Product } from "@/models/Product";

export const ProductDetail = ({
  slug,
}: {
  slug: string;
}): React.JSX.Element => {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [currentColor, setCurrentColor] = useState();
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>();

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const product_f = await fetchProductBySlug(slug);
    const products = await fetchProducts({
      category: product_f?.category?.id,
      limit: 5,
    });
    setProducts(products.products);
    setProduct(product_f);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        className={twMerge("my-10", latoRegular.className)}
        size="md"
        variant={"light"}
      >
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Products</BreadcrumbItem>
        <BreadcrumbItem>{product?.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="col-span-1 md:col-span-3 h-auto md:h-146 grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-1 md:col-span-4 mr-3 my-2 overflow-hidden relative flex justify-center bg-anitiqueWhite rounded-2xl">
            <Image
              className="w-full h-auto md:h-full"
              src={product?.images ? product.images[currentImage].url : ""}
              alt="product image"
            />
          </div>

          <div className="h-auto md:h-146 overflow-x-auto md:overflow-y-scroll flex flex-row md:flex-col gap-2 mr-0 md:mr-6">
            {product?.images?.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`relative mb-2 flex justify-center items-center size-32 bg-anitiqueWhite rounded-2xl border-2 ${currentImage === index ? 'border-blurEffect' : ''
                  }`}
              >
                <div className="relative shadow-black/5 shadow-none rounded-large w-full h-full">
                  <img
                    className="rounded-large w-full h-full object-contain"
                    src={item.url}
                    alt="product thumbnail"
                  />
                </div>
              </button>
            ))}
          </div>

        </div>

        <div className="col-span-1 md:col-span-2 ml-0 md:ml-8">
          <div className="max-w-sm">
            <h1
              className={twMerge(
                cormorantMedium.className,
                "text-textPrimary text-2xl md:text-4xl text-start mt-3"
              )}
            >
              {product?.name}
            </h1>

            <div className="flex gap-1 mt-3">
              <h3
                className={twMerge(
                  latoRegular.className,
                  "text-textSecondary text-xs text-start"
                )}
              >
                {"Category:"}
              </h3>
              <h3
                className={twMerge(
                  latoRegular.className,
                  "text-textPrimary text-xs text-start"
                )}
              >
                {product?.category?.name.toLowerCase()}
              </h3>
            </div>

            <div className="mt-8">
              <p
                className={twMerge(
                  latoRegular.className,
                  "text-textSecondary text-base text-start"
                )}
              >
                {product?.description}
              </p>
            </div>

            <div className="flex gap-6 mt-9">
              <p
                className={twMerge(
                  latoRegular.className,
                  "text-textSecondary text-base text-start"
                )}
              >
                {"Color "}
              </p>

              <div className="flex gap-3 flex-wrap">
                {product?.images?.map((image, index) => (
                  <ColorButton
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    isChosen={currentImage === index}
                    style={{ background: image?.color === "none" ? "#fff" : (image?.color || "#fff") }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <p
          className={twMerge(
            latoBold.className,
            "text-textPrimary text-base text-start"
          )}
        >
          {"Product Specifications"}
        </p>
        <Table
          className="mt-6"
          defaultSelectedKeys={["2"]}
          aria-label="information table"
          classNames={{
            tbody: "border border-tableBorder500",
          }}
        >
          <TableHeader>
            <TableColumn className="hidden">Specs</TableColumn>
            <TableColumn className="hidden">Info</TableColumn>
          </TableHeader>
          <TableBody>
            {[
              { label: "Category", value: product?.category?.name },
              { label: "SKU", value: product?.specification?.sku },
              { label: "Tag", value: product?.specification?.tags },
              { label: "Dimensions (cm)", value: product?.specification?.dimensions },
              { label: "Materials", value: product?.specification?.materials },
            ].map((spec, index) => (
              <TableRow className="border border-tableBorder400" key={index}>
                <TableCell
                  className={twMerge(
                    "bg-backgroundDecor100 text-textSecondary text-base",
                    latoRegular.className
                  )}
                >
                  {spec.label}
                </TableCell>
                <TableCell
                  className={twMerge(
                    "bg-themeWhite text-textPrimary text-base",
                    latoRegular.className
                  )}
                >
                  {spec.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="my-12">
        <h2
          className={twMerge(
            cormorantRegular.className,
            "text-textPrimary text-2xl md:text-4xl text-start mt-3"
          )}
        >
          {"You may be interested in"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mt-8 gap-4">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              onClick={() => {
                router.push("products/product-detail/" + item.slug);
              }}
              className="m-2"
              src={
                item.images ? item.images[0].url : "/images/demo_product_1.png"
              }
              name={item.name ?? "Product"}
              category={item.specification?.materials ?? ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ColorButton = ({
  color,
  isChosen = false,
  onClick,
  style,
}: {
  color?: string;
  isChosen?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "rounded-full w-6 h-6 border border-textSecondary",
        isChosen ? "border-3 border-textPrimary" : ""
      )}
      style={style}
    ></button>
  );
};
