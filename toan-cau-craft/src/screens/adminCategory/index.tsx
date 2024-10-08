"use client";
import { latoRegular } from "@/fonts";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Plus } from "lucide-react";
import * as Yup from "yup";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import {
  addCategory,
  Category,
  columns,
  deleteaddCategoryByIds,
  fetchCategories,
  handleUploadImage,
  updateCategory,
} from "@/models/Category";
import { renderCell } from "./RenderCell";
import ModalCommon from "@/components/Modals/ModalCommon";
import slugify from "slugify";
import Lottie from "react-lottie";
import { LottieApp } from "@/utils/lotties";
import { AddingImageButton } from "./AddingImageButton";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type CategoryInput = {
  name: string;
};

interface IExportDateImage {
  name: string | undefined;
  image: File | undefined;
}

export const AdminCategory = (): React.JSX.Element => {
  const router = useRouter();
  const addingModal = useDisclosure();
  const responseModal = useDisclosure();
  const updateModal = useDisclosure();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string>();
  const [image, setImage] = useState<IExportDateImage>();
  const [categoryUpdate, setCategoryUpdate] = useState<Category>();

  const [categories, setCategories] = useState<Category[]>([]);

  const AddProductSchema = Yup.object().shape({
    name: Yup.string().required("* Bạn cần điền thông tin này"),
  });

  useEffect(() => {
    fetchInitCategories();
  }, []);

  const fetchInitCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const onSubmit = async (
    values: CategoryInput,
    { setSubmitting }: FormikHelpers<CategoryInput>
  ) => {
    addingModal.onClose();
    responseModal.onOpen();
    setIsLoading(true);
    setResponseMessage("Đang tải ảnh lên bộ nhớ đám mây");
    const imagesUpload = await handleUploadImage({
      image: image?.image,
      name: image?.name || ''
    });

    setResponseMessage("Đang cập nhật dữ liệu mới");
    addCategory({
      category: {
        name: values.name,
        slug: slugify(values.name, {
          lower: true,
        }),
        image: imagesUpload
      },
    }).then((data) => {
      if (data.data) {
        setIsLoading(false);
        setCategories([
          {
            id: data.data.id,
            name: values.name,
            slug: slugify(values.name, {
              lower: true,
            }),
            image: imagesUpload
          },
          ...categories,
        ]);
        setResponseMessage("Thêm mới thành công");
        setTimeout(() => {
          responseModal.onClose();
        }, 2000);
      } else if (data.error) {
        if((data.error as any).code === "permission-denied") {
          toast.error('Bạn không có quyền truy cập!')
          router.push('/admin/login')
        } else {
          setResponseMessage("Có lỗi xảy ra: \n" + data.error);
        }
      }
    });
    setSubmitting(false);
  };

  const onUpdate = async (
    values: CategoryInput,
    { setSubmitting }: FormikHelpers<CategoryInput>
  ) => {
    updateModal.onClose();
    responseModal.onOpen();
    setIsLoading(true);

    if(!categoryUpdate) return;

    let imageUpload = categoryUpdate?.image || '';
    
    if(image?.image){
      setResponseMessage("Đang tải ảnh lên bộ nhớ đám mây");
      imageUpload = await handleUploadImage({
        image: image?.image,
        name: image?.name || ''
      });
  
      setResponseMessage("Đang cập nhật dữ liệu mới");
    }
    
    updateCategory({
      category: {
        name: values.name,
        slug: slugify(values.name, {
          lower: true,
        }),
        image: imageUpload
      },
      categoryId: categoryUpdate?.id 
    }).then((data) => {
      if (data.data) {
        setIsLoading(false);
        setCategories(categories.map(category => {
          return {
            ...category,
            name: category.id === data.data.id ? values.name : category.name,
            image: category.id === data.data.id ? imageUpload : category.image,
            slug: category.id === data.data.id ? slugify(values.name, {
              lower: true,
            }) : category.slug,
          }
        }))
        setResponseMessage("Cập nhật thành công");
        setTimeout(() => {
          responseModal.onClose();
        }, 2000);
      } else if (data.error) {
        if((data.error as any).code === "permission-denied") {
          toast.error('Bạn không có quyền truy cập!')
          router.push('/admin/login')
        } else {
          setResponseMessage("Có lỗi xảy ra: \n" + data.error);
        }
      }
    });
    setSubmitting(false);
  };

  const resetState = () => {
    setIsLoading(false);
    setResponseMessage("Vui lòng đợi...");
  };

  const onClickDelete = (id: string) => {
    setIsLoading(true);
    responseModal.onOpen();
    deleteaddCategoryByIds(id)
      .then((data) => {
        if(data.success){
          setIsLoading(false);
          setResponseMessage("Xoá thành công");
          setIsSuccess(true);
          setTimeout(() => {
            responseModal.onClose();
          }, 2000);
          setCategories((prevCategories) => prevCategories.filter(category => category.id !== id));
        } else {
          if((data.error as any).code === "permission-denied") {
            toast.error('Bạn không có quyền truy cập!')
            router.push('/admin/login')
          } else {
            setResponseMessage("Có lỗi xảy ra: \n" + data.error);
          }
        }
        
      })
      .catch((e) => {
        setIsLoading(false);
        setResponseMessage("Có lỗi xảy ra :" + e);
        setIsSuccess(false);
      });
  };
  const onClickEdit = (category: Category) => {
    setCategoryUpdate(category);
    updateModal.onOpen();
  }

  const onImagesUploadPreview = (
    { image, name }: IExportDateImage,
  ) => {
    setImage({
      image,
      name
    })
  };


  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem>Trang chủ</BreadcrumbItem>
        <BreadcrumbItem>Quản lí phân loại 1</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-between mt-3">
        <h1
          className={twMerge(
            "text-textPrimary text-3xl",
            latoRegular.className
          )}
        >
          Quản lí phân loại 1(Category)
        </h1>
        <Button
          onClick={() => {
            addingModal.onOpen();
          }}
          type="button"
          color="success"
        >
          <h3>Thêm phân loại 1(category)</h3>
          <Plus size={25} />
        </Button>
      </div>

      <Table className="mt-5" aria-label="Example table with custom cells">
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
        <TableBody items={categories}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell({
                    category: item,
                    columnKey: columnKey,
                    onClickDelete: () => onClickDelete(item.id),
                    onClickEdit: () => onClickEdit(item)
                  })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* //modal */}
      <ModalCommon disclosure={addingModal} size={"2xl"}>
        <h2 className="text-textPrimary text-2xl my-5">
          Thêm phân loại 1 (Category)
        </h2>
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={AddProductSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Field name="name">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    classNames={{
                      label: "text-textSecondary mb-3",
                      base: "bg-black flex gap-5",
                      input: "placeholder:text-textTertiary text-xl",
                      description: "text-textTertiary",
                    }}
                    className="text-textPrimary"
                    name="name"
                    size="lg"
                    isInvalid={errors.name && touched.name ? true : false}
                    label="Tên phân loại"
                    variant="faded"
                    errorMessage={
                      errors.name && touched.name ? errors.name : null
                    }
                  />
                )}
              </Field>
              <div>
                <AddingImageButton 
                  onImagesUploadPreview={({image, name}) => onImagesUploadPreview({image, name})}
                  imageDefault={categoryUpdate?.image || ''}
                />
              </div>
              <div className="flex flex-row gap-5 mt-5">
                <Button type="submit" color="primary">
                  Tiếp tục
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </ModalCommon>

      <ModalCommon disclosure={updateModal} size={"2xl"}>
        <h2 className="text-textPrimary text-2xl my-5">
          Sửa phân loại 1 (Category)
        </h2>
        <Formik
          initialValues={{
            name: categoryUpdate?.name || '',
          }}
          validationSchema={AddProductSchema}
          onSubmit={onUpdate}
        >
          {({ errors, touched }) => (
            <Form>
              <Field name="name">
                {({ field }: FieldProps) => (
                  <Input
                    {...field}
                    classNames={{
                      label: "text-textSecondary mb-3",
                      base: "bg-black flex gap-5",
                      input: "placeholder:text-textTertiary text-xl",
                      description: "text-textTertiary",
                    }}
                    className="text-textPrimary"
                    name="name"
                    size="lg"
                    isInvalid={errors.name && touched.name ? true : false}
                    label="Tên phân loại"
                    variant="faded"
                    errorMessage={
                      errors.name && touched.name ? errors.name : null
                    }
                  />
                )}
              </Field>
              <div>
                <AddingImageButton 
                  onImagesUploadPreview={({image, name}) => onImagesUploadPreview({image, name})}
                  imageDefault={categoryUpdate?.image || ''}
                />
              </div>
              <div className="flex flex-row gap-5 mt-5">
                <Button type="submit" color="primary">
                  Cập nhật
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </ModalCommon>

      <ModalCommon onCloseModal={resetState} disclosure={responseModal}>
        <p className="text-textPrimary text-xl my-5">{responseMessage}</p>
        {isLoading ? (
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
        ) : isSuccess ? (
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
    </div>
  );
};
