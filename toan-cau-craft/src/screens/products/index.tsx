"use client"
import React, { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { TopBanner } from "@/components/TopBanner";
import { cormorantSemiBold, latoRegular } from "@/fonts";
import { twMerge } from "tailwind-merge";
import { FilterBox } from "./FilterBox";
import PaginationApp from "@/components/PaginationApp";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchProducts, FetchProductsParams, Product } from "@/models/Product";
import { Category, fetchCategories } from "@/models/Category";
import { fetchTypes, Type } from "@/models/Type";
import { SearchBox } from "@/components/SearchBox";
import { SlidersHorizontal, X } from "lucide-react";
import { asyncState } from "@/utils/constants";
import { ProductSkeletonCard } from "@/components";
import { getBannerByType } from "@/models/Banner";
import { Dialog } from '@headlessui/react'; // Add Headless UI for modal
import { FilterCard } from "./FilterCard";
import { useDisclosure } from "@nextui-org/react";

export const Products = (): React.JSX.Element => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalItems, setTotalItem] = useState<number>(1);
  const [state, setState] = useState<string>(asyncState.loading);
  const [banner, setBanner] = useState<string | undefined>();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false); // State for modal visibility

  const getBanner = async () => {
    const data = await getBannerByType('product') as any;
    setBanner(data?.data?.url || "/images/products.png");
  }

  useEffect(() => {
    getBanner();
  }, [])

  const modalDialog = useDisclosure();

  const searchParams = useSearchParams();
  const filterCategory = searchParams.get("category") || undefined;
  const filterType = searchParams.get("type") || undefined;
  const filterName = searchParams.get("name") || undefined;

  const topProductRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState<FetchProductsParams>({
    page: 1,
    limit: 12,
    category: filterCategory,
    type: filterType,
    name: filterName,
  });

  useEffect(() => {
    fetchInit();
  }, []);

  useEffect(() => {
    handleNavigateFilter();
  }, [filterCategory, filterType, filterName]);

  const handleNavigateFilter = () => {
    setFilter({
      ...filter,
      category: filterCategory,
      type: filterType,
      name: filterName,
    })
  }

  const fetchInit = async () => {
    await fetchProduct();
    const cates = await fetchCategories();
    const types = await fetchTypes();

    setCategories(cates);
    setTypes(types);
  };

  const fetchProduct = async () => {
    setState(asyncState.loading);
    const products = await fetchProducts(filter);
    setProducts(products.products);
    setTotalPage(products.totalPages);
    setTotalItem(products.totalDocs);
    setTimeout(() => {
      setState(asyncState.success);
    }, 500);
  };

  useEffect(() => {
    fetchProduct();
  }, [filter]);

  const handleFilterClick = () => {
    setIsFilterModalOpen(true); // Open the filter modal
  };

  const applyFilterAndClose = (key: 'category' | 'type', value: string | undefined) => {
    setFilter({
      ...filter,
      [key]: value,
    });
  };

  return (
    <div className="bg-themeWhite">
      <div>
        <TopBanner
          src={banner || "/images/products.png"}
          h1="Handicraft"
          h2="MADE WITH LOVE"
          description="Lorem ipsum dolor sit amet consectetur. Tempor faucibus sit iaculis arcu felis. Volutpat sollicitudin tortor aliquam maecenas porttitor ac et blandit. Pretium urna at ac purus aliquet mauris. Sit feugiat mattis turpis congue justo."
        />

        <div className="mx-4 sm:mx-8 lg:mx-28 my-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hidden md:block md:col-span-1 bg-themeWhite h-auto md:h-screen overflow-y-scroll sticky top-0">
            <div className="md:hidden p-4">
              <button
                className="w-full py-2 px-4 bg-blue-500 text-white rounded"
                onClick={() => modalDialog.onOpen()} // Open modal on mobile filter button click
              >
                Filters
              </button>
            </div>

            <div className="hidden md:block">
              <div className="sticky pt-8 bg-themeWhite top-0 z-10">
                <h1
                  className={twMerge(
                    cormorantSemiBold.className,
                    "text-textPrimary text-4xl"
                  )}
                >
                  PRODUCTS
                </h1>
                <SearchBox
                  onSubmit={(keys) =>
                    setFilter({
                      ...filter,
                      name: keys,
                    })
                  }
                  className="w-full mt-3 bg-themeWhite"
                />
                <div className="w-full h-5 bg-white-vertical"></div>
              </div>
              <FilterBox
                onCheck={(id) =>
                  setFilter({
                    ...filter,
                    category: id,
                  })
                }
                chosen={filter.category}
                title="Category"
                data={categories.map((item) => ({
                  value: item.id,
                  key: item.name,
                }))}
              />
              <FilterBox
                onCheck={(id) =>
                  setFilter({
                    ...filter,
                    type: id,
                  })
                }
                chosen={filter.type}
                className="mt-4 pb-16"
                title="Type"
                data={types.map((item) => ({ value: item.id, key: item.name }))}
              />
            </div>
          </div>

          <div className="md:col-span-2 relative">
            <div className="sticky top-0 z-50 pt-3 rounded-2xl bg-transBlue backdrop-blur">
              <h3
                className={twMerge(
                  latoRegular.className,
                  "text-textSecondary text-base pl-2"
                )}
              >
                {totalItems} results
              </h3>

              <div className="flex items-center py-3 p-3 rounded-2xl">

                <SlidersHorizontal
                  className="mr-2 md:hidden block"
                  size={15}
                  color="#a6a6a6"
                  onClick={() => modalDialog.onOpen()} // Open modal when clicking the filter icon
                />

                <SlidersHorizontal
                  className="mr-2 md:block hidden "
                  size={15}
                  color="#a6a6a6"
                />

                {/* Filter selections */}
                {filter.category && (
                  <FilterCard
                    onRemove={() => setFilter({ ...filter, category: undefined })}
                    content={`Category: ${categories.find((item) => item.id == filter.category)?.name}`}
                  />
                )}

                {filter.type && (
                  <FilterCard
                    onRemove={() => setFilter({ ...filter, type: undefined })}
                    content={`Type: ${types.find((item) => item.id == filter.type)?.name}`}
                  />
                )}

                {filter.name && (
                  <FilterCard
                    onRemove={() => setFilter({ ...filter, name: undefined })}
                    content={`Key words: ${filter.name}`}
                  />
                )}
              </div>
            </div>

            <div ref={topProductRef}></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {state === asyncState.success
                ? products.map((item) => (
                  <ProductCard
                    key={item.id}
                    onClick={() => {
                      router.push("products/product-detail/" + item.slug);
                    }}
                    className="m-2"
                    src={
                      item.images
                        ? item.images[0].url
                        : "/images/demo_product_1.png"
                    }
                    name={item.name ?? "Product"}
                    category={item.specification?.materials ?? ""}
                  />
                ))
                : Array.from({ length: 12 }).map((_, index) => (
                  <ProductSkeletonCard key={index} />
                ))}
            </div>
            <div className="mt-10">
              <PaginationApp
                setPage={(page) => {
                  setFilter({
                    ...filter,
                    page,
                  });
                }}
                total={totalPage}
              />
            </div>
          </div>
        </div>
      </div>


      {/* Modal for filter options */}
      <Dialog open={modalDialog.isOpen} onClose={() => modalDialog.onClose()} className="block md:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-end z-50 ">
          <div className="bg-anitiqueWhite p-4 rounded-t-lg w-full max-h-[65vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-themeDark">Filters</h2>
              <button
                className="text-themeDark"
                onClick={() => modalDialog.onClose()}
              >
                <X size={20} />
              </button>
            </div>

            {/* Category Section */}
            <div>
              <h3 className="text-base font-semibold text-themeDark mb-2">Category</h3>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={filter.category === category.id}
                      onChange={() => applyFilterAndClose('category', category.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-themeDark">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Section */}
            <div className="mt-4">
              <h3 className="text-base font-semibold text-themeDark mb-2">Type</h3>
              <div className="grid grid-cols-2 gap-4">
                {types.map((type) => (
                  <div key={type.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`type-${type.id}`}
                      checked={filter.type === type.id}
                      onChange={() => applyFilterAndClose('type', type.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`type-${type.id}`} className="text-themeDark">
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </Dialog>


    </div>
  );
};
