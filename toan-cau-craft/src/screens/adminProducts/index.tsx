"use client";
import { latoRegular } from "@/fonts";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { renderCell } from "./RenderCell";
import {
  columns,
  deleteProduct,
  fetchProducts,
  FetchProductsParams,
  Product,
} from "@/models/Product";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie";
import ModalCommon from "@/components/Modals/ModalCommon";
import ModalConfirm, { ModalConfirmRef } from "@/components/Modals/ModalConfirm";
import { asyncState } from "@/utils/constants";
import { LottieApp } from "@/utils/lotties";
import { Category, fetchCategories } from "@/models/Category";
import { fetchTypes, Type } from "@/models/Type";

export const AdminProducts = (): React.JSX.Element => {
  const router = useRouter();
  const responseModal = useDisclosure();
  const confirmModal = useDisclosure();

  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [state, setState] = useState<string>(asyncState.loading);
  const [responseMessage, setResponseMessage] = useState<string>();

  const confirmModalRef = useRef<ModalConfirmRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<FetchProductsParams>({
    page: 1,
    limit: 12,
    category: '',
    type: '',
    name: '',
  });
  const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFilter({
      ...filter,
      [name]: value
    })
  }
  const handleNameFilterChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      const {name, value} = (e.target as HTMLInputElement);
      setFilter({
        ...filter,
        [name]: value
      })
    }
   
  }
  const rowsPerPage = 5;

  useEffect(() => {
    fetchInitCategories();
    fetchInitTypes();
  }, []);

  useEffect(() => {
    fetchInitProducts();
  }, [filter]);

  const fetchInitProducts = async () => {
    setIsLoading(true);
    const products = await fetchProducts(filter);
    setIsLoading(false);
    setProducts(products.products);
    setTotalPage(products.totalPages);
  };

  const fetchInitCategories = async () => {
    const res = await fetchCategories();
    setCategories(res)
  }
  const fetchInitTypes = async () => {
    const res = await fetchTypes();
    setTypes(res)
  }


  const handleDeleteProduct = async (id: string) => {
    confirmModal.onOpen()
    confirmModalRef.current?.setOnConfirm(() => {
      confirmModal.onClose()
      responseModal.onOpen()
      setResponseMessage("Đang xoá sản phẩm...")
      deleteProduct(id).then(() => {
        let updatedProducts = products;
        if (updatedProducts) {
          updatedProducts = updatedProducts.filter((item) => item.id !== id);
        }
        setProducts(updatedProducts)
        setResponseMessage("Hoàn tất")
        setState(asyncState.success)
        setTimeout(() => {
          responseModal.onClose()
        }, 2000)
      }).catch((e) => {
        setResponseMessage("Gặp lỗi khi xoá sản phẩm: " + e)
        setState(asyncState.error)
      })
    })
  };

  const resetState = () => {
    setState(asyncState.loading);
    setResponseMessage("Vui lòng đợi...");
  };

  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem>Trang chủ</BreadcrumbItem>
        <BreadcrumbItem>Quản lí sản phẩm</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-between mt-3">
        <h1
          className={twMerge(
            "text-textPrimary text-3xl",
            latoRegular.className
          )}
        >
          Quản lý sản phẩm
        </h1>
        <Button
          onClick={() => {
            router.push("products/add-new");
          }}
          type="button"
          color="success"
        >
          <h3>Thêm sản phẩm</h3>
          <Plus size={25} />
        </Button>
      </div>
      <div className="flex items-center justify-between mt-5">
        <div className="w-1/5">
          <Input 
            label="Tên sản phẩm" 
            name="name"
            endContent={<Search color="#000" height={'100%'}/>} 
            onKeyDown={(e:  React.KeyboardEvent<HTMLInputElement>) => handleNameFilterChange(e)}
            />
        </div>
        <div className="flex w-3/5 space-x-4">
          <Select defaultSelectedKeys={[filter.category || '']} label="Category" name="category" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeFilter(e)}>
            <SelectItem className="text-themeDark" key={''} >All</SelectItem>
            {
              categories && categories.map((category) =>
                <SelectItem className="text-themeDark" key={category.id} >{category.name}</SelectItem>
              ) as any
            }
          </Select>
          <Select defaultSelectedKeys={[filter.type || '']} label="Type" name="type" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeFilter(e)}>
            <SelectItem className="text-themeDark" key={''}>All</SelectItem>
            {
              types && types.map((type) =>
                <SelectItem className="text-themeDark" key={type.id}>{type.name}</SelectItem>
              ) as any
            }
          </Select>
        </div>
      </div>


      <Table
        className="mt-5"
        aria-label="Example table with custom cells"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={filter.page}
              total={totalPage}
              onChange={(page) => setFilter({
                ...filter,
                page: page
              })}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={products} isLoading={isLoading} loadingContent={<Spinner label="Loading..." />}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell({
                    product: item,
                    columnKey: columnKey,
                    onGoUpdate: (slug) => {
                      router.push("/admin/products/update/" + slug);
                    },
                    onDelete: (id) => handleDeleteProduct(id),
                  })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ModalCommon onCloseModal={resetState} disclosure={responseModal}>
        <p className="text-textPrimary text-xl my-5">{responseMessage}</p>
        {state == asyncState.loading ? (
          <Lottie
            style={{ width: 100, height: 100 }}
            options={{
              loop: true,
              autoplay: true,
              animationData: LottieApp.Loading,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            isClickToPauseDisabled={true}
            width={"100%"}
          />
        ) : state == asyncState.success ? (
          <Lottie
            style={{ width: 100, height: 100 }}
            options={{
              loop: true,
              autoplay: true,
              animationData: LottieApp.Success,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            isClickToPauseDisabled={true}
            width={"100%"}
          />
        ) : (
          <Lottie
            style={{ width: 100, height: 100 }}
            options={{
              loop: true,
              autoplay: true,
              animationData: LottieApp.Error,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            isClickToPauseDisabled={true}
            width={"100%"}
          />
        )}
      </ModalCommon>
      <ModalConfirm
        variant={3}
        ref={confirmModalRef}
        disclosure={confirmModal}
      >
        <></>
      </ModalConfirm>
    </div>
  );
};
