"use client";
import React, { useRef } from "react";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { latoRegular } from "@/fonts";
import * as Yup from "yup";
import { twMerge } from "tailwind-merge";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import slugify from "slugify";
import { Category, fetchCategories } from "@/models/Category";
import { fetchTypes, Type } from "@/models/Type";
import {
  fetchProductBySlug,
  Product,
  Specification,
  updateProduct,
  updateProductImage,
} from "@/models/Product";
import { PlusCircle, Save } from "lucide-react";
import ModalCommon from "@/components/Modals/ModalCommon";
import Lottie from "react-lottie";
import { LottieApp } from "@/utils/lotties";
import {
  AddingImageButton,
  ExportDataImage,
} from "../adminProductAddNew/AddingImageButton";
import ModalConfirm, {
  ModalConfirmRef,
} from "@/components/Modals/ModalConfirm";
import { deleteImage, uploadImage } from "@/utils/CloudStorage";
import { asyncState, inputSlots, statusObject } from "@/utils/constants";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export type AddProductInput = {
  name: string;
  description: string;
  category?: string;
  type?: string;
  slug?: string;
};

export const AdminProductUpdate = ({
  slug,
}: {
  slug: string;
}): React.JSX.Element => {
  const router = useRouter();
  const responseModal = useDisclosure();
  const confirmModal = useDisclosure();

  const [product, setProduct] = useState<Product | null>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [images, setImages] = useState<ExportDataImage[]>([]);
  const [spec, setSpec] = useState<Specification>();
  const [state, setState] = useState<string>(asyncState.loading);
  const [responseMessage, setResponseMessage] = useState<string>();
  const [variant, setVariant] = useState<number>(0);

  const confirmModalRef = useRef<ModalConfirmRef>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const AddProductSchema = Yup.object().shape({
    name: Yup.string().required("* Bạn cần điền thông tin này"),
    description: Yup.string().required("* Bạn cần điền thông tin này"),
    category: Yup.string().required("* Bạn cần điền thông tin này"),
    type: Yup.string().required("* Bạn cần điền thông tin này"),
  });

  const fetchData = async () => {
    const product_f = await fetchProductBySlug(slug);
    const cates = await fetchCategories();
    const types = await fetchTypes();

    setProduct(product_f);
    setSpec(product_f?.specification);
    setCategories(cates);
    setTypes(types);
  };

  const onSubmit = async (
    values: AddProductInput,
    { setSubmitting }: FormikHelpers<AddProductInput>
  ) => {
    responseModal.onOpen();
    setState(asyncState.loading);
    setResponseMessage("Đang cập nhật dữ liệu mới");
    await updateProduct({
      productId: product?.id ?? "",
      product: {
        name: values.name,
        description: values.description,
        category: values.category ?? "",
        type: values.type ?? "",
        specification: spec,
        slug: slugify(values.name, {
          lower: true,
        }),
        updateAt: new Date().toISOString(),
        status: "active",
      },
    }).then((data) => {
      if (data.data) {
        setState(asyncState.success);
        setResponseMessage("Cập nhập thành công");
        setTimeout(() => {
          responseModal.onClose();
        }, 2000);
      } else if (data.error) {
        if((data.error as any).code === "permission-denied") {
          toast.error('Bạn không có quyền truy cập!')

          router.push(`/admin/login`)
        } else {
          setResponseMessage("Có lỗi xảy ra: \n" + data.error);
        }
      }
    });
    setSubmitting(false);
  };

  const onImagesUploadPreview = (
    { image, name, color }: ExportDataImage,
    index: number
  ) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = { ...updatedImages[index], image, color, name };
      return updatedImages;
    });
  };

  const onCommitChangeUploadImage = async (
    { image, color }: ExportDataImage,
    index: number
  ) => {
    confirmModal.onClose();
    responseModal.onOpen();
    setState(asyncState.loading);
    setResponseMessage("Đang xoá ảnh cũ(nếu có)");
    try {
      if (product?.images && product?.images[index].url) {
        await deleteImage(product?.images[index].url).then().catch();
      }
    } catch (error) {
      setResponseMessage("Gặp vấn đề khi xoá ảnh cũ: " + error);
    }

    const updatedImages = product?.images;

    try {
      setResponseMessage("Đang tải ảnh lên bộ nhớ đám mây");
      const imageUploaded = await uploadImage({
        color: color,
        image: image,
      });

      if (updatedImages) {
        updatedImages[index] = {
          ...updatedImages[index],
          url: imageUploaded.url,
          color,
        };
      }
    } catch (error) {
      setResponseMessage("Gặp vấn đề khi tải ảnh lên bộ nhớ đám mây: " + error);
    }

    responseModal.onOpen();
    setState(asyncState.loading);
    setResponseMessage("Đang cập nhật dữ liệu mới");
    await updateProductImage({
      productId: product?.id ?? "",
      product: {
        images: updatedImages,
        updateAt: new Date().toISOString(),
      },
    }).then((data) => {
      if (data.data) {
        setState(asyncState.success);
        setResponseMessage("Cập nhập thành công");
        setImages([]);
        setTimeout(() => {
          responseModal.onClose();
        }, 2000);
      } else if (data.error) {
        if((data.error as any).code === "permission-denied") {
          toast.error('Bạn không có quyền truy cập!')

          router.push(`/admin/login`)
        } else {
          setResponseMessage("Có lỗi xảy ra: \n" + data.error);
        }
      }
    });
  };

  const resetState = () => {
    setState(asyncState.loading);
    setResponseMessage("Vui lòng đợi...");
  };

  const onDeleteImageField = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onDeleteImageSource = async (url: string, index: number) => {
    responseModal.onOpen();
    setState(asyncState.loading);
    setResponseMessage("Đang xoá ảnh");
    await deleteImage(url)
      .then(() => {
        setResponseMessage("Xoá ảnh thành công");
        setState(asyncState.success);
        setTimeout(() => {
          responseModal.onClose();
        }, 2000);
      })
      .catch((e) => {
        setResponseMessage("Có lỗi xảy ra: " + e);
      });

    setResponseMessage("Đang cập nhật dữ liệu mới");
    let updatedImages = product?.images;
    if (updatedImages) {
      updatedImages = updatedImages.filter((_, i) => i !== index);
    }
    await updateProductImage({
      productId: product?.id ?? "",
      product: {
        images: updatedImages,
        updateAt: new Date().toISOString(),
      },
    }).then((data) => {
      if (data.data) {
        setState(asyncState.success);
        setResponseMessage("cập nhập thành công");
        setProduct({
          ...product,
          images: updatedImages ?? [],
        });
        setImages([]);
        setTimeout(() => {
          responseModal.onClose();
        }, 2000);
      } else if (data.error) {
        if((data.error as any).code === "permission-denied") {
          toast.error('Bạn không có quyền truy cập!')
          
          router.push(`/admin/login`)
        } else {
          setResponseMessage("Có lỗi xảy ra: \n" + data.error);
        }
      }
    });
  };

  return (
    <div className="p-5">
      <Breadcrumbs>
        <BreadcrumbItem>Trang chủ</BreadcrumbItem>
        <BreadcrumbItem>Quản lí sản phẩm</BreadcrumbItem>
        <BreadcrumbItem>Cập nhập thông tin</BreadcrumbItem>
        <BreadcrumbItem>
          {product ? product.name : "Tên sản phẩm"}
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex justify-between mt-3">
        <h1
          className={twMerge(
            "text-textPrimary text-3xl",
            latoRegular.className
          )}
        >
          Cập nhập thông tin sản phẩm
        </h1>
      </div>

      <div className="mt-5">
        <h2
          className={twMerge(
            "text-textPrimary text-xl my-3",
            latoRegular.className
          )}
        >
          I. Thông tin cơ bản
        </h2>
        {product ? (
          <Formik
            initialValues={{
              name: product.name ?? "",
              description: product.description ?? "",
              category: product?.category?.id ?? "",
              type: product?.type?.id ?? "",
            }}
            validationSchema={AddProductSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <Input
                  classNames={inputSlots}
                  value={product?.id}
                  disabled
                  className="text-textPrimary mb-3"
                  name="name"
                  size="lg"
                  label="Id"
                  variant="faded"
                />

                <Field name="name">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      classNames={inputSlots}
                      className="text-textPrimary"
                      name="name"
                      size="lg"
                      isInvalid={errors.name && touched.name ? true : false}
                      label="Tên sản phẩm"
                      variant="faded"
                      errorMessage={
                        errors.name && touched.name ? errors.name : null
                      }
                    />
                  )}
                </Field>

                <Field name="description">
                  {({ field }: FieldProps) => (
                    <Textarea
                      {...field}
                      classNames={inputSlots}
                      name="description"
                      className="mt-5 text-xl text-textPrimary"
                      label="Mô tả cho sản phẩm"
                      isInvalid={!!errors.description && touched.description}
                      variant="faded"
                      errorMessage={
                        errors.description && touched.description
                          ? errors.description
                          : null
                      }
                    />
                  )}
                </Field>

                <Field name="category">
                  {({ field }: FieldProps) => (
                    <Select
                      {...field}
                      classNames={inputSlots}
                      name="category"
                      className="mt-5 text-xl text-textPrimary"
                      label="Category/Phân loại 1"
                      isInvalid={!!errors.category && touched.category}
                      variant="faded"
                      errorMessage={
                        errors.category && touched.category
                          ? errors.category
                          : null
                      }
                      defaultSelectedKeys={[product.category?.id ?? ""]}
                    >
                      {categories && categories.length > 0 ? (
                        categories.map((item) => (
                          <SelectItem
                            className="text-textPrimary"
                            value={item.id}
                            key={item.id}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key="n/a">N/A</SelectItem>
                      )}
                    </Select>
                  )}
                </Field>

                <Field name="type">
                  {({ field }: FieldProps) => (
                    <Select
                      {...field}
                      classNames={inputSlots}
                      name="type"
                      className="mt-5 text-xl text-textPrimary"
                      label="Type/Phân loại 2"
                      isInvalid={!!errors.type && touched.type}
                      variant="faded"
                      errorMessage={
                        errors.type && touched.type ? errors.type : null
                      }
                      defaultSelectedKeys={[product?.type?.id ?? ""]}
                    >
                      {types && types.length > 0 ? (
                        types.map((item) => (
                          <SelectItem
                            className="text-textPrimary"
                            value={item.id}
                            key={item.id}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key="n/a">N/A</SelectItem>
                      )}
                    </Select>
                  )}
                </Field>

                <Field name="status">
                  {({ field }: FieldProps) => (
                    <Select
                      {...field}
                      items={statusObject}
                      defaultSelectedKeys={["active"]}
                      classNames={inputSlots}
                      name="type"
                      className="mt-5 text-xl text-textPrimary"
                      label="Trạng thái (Nếu chọn pause, sản phẩm sẽ chưa hiển thị trên trang khách hàng cho đến khi bạn thay đổi trạng thái của sản phẩm này)"
                      isInvalid={!!errors.type && touched.type}
                      variant="faded"
                      errorMessage={
                        errors.type && touched.type ? errors.type : null
                      }
                      renderValue={(items) => {
                        return items.map((item) => (
                          <p key={item.key}>{item.key}</p>
                        ));
                      }}
                    >
                      <SelectItem value={"active"} key={"active"}>
                        <p className="text-danger-500">active</p>
                      </SelectItem>
                      <SelectItem value={"pause"} key={"pause"}>
                        <p className="text-success-500">pause</p>
                      </SelectItem>
                    </Select>
                  )}
                </Field>

                <div className="mt-5">
                  <h2
                    className={twMerge(
                      "text-textPrimary text-xl my-3",
                      latoRegular.className
                    )}
                  >
                    II. Thông tin chi tiết
                  </h2>
                  <Input
                    classNames={inputSlots}
                    className="text-textPrimary my-2"
                    name="name"
                    size="lg"
                    value={spec?.sku}
                    onChange={(e) =>
                      setSpec({
                        ...spec,
                        sku: e.target.value,
                      })
                    }
                    label="SKU (Mã sản phẩm)"
                    variant="faded"
                  />
                  <Input
                    classNames={inputSlots}
                    className="text-textPrimary my-2"
                    name="name"
                    size="lg"
                    value={spec?.tags}
                    onChange={(e) =>
                      setSpec({
                        ...spec,
                        tags: e.target.value,
                      })
                    }
                    label="Tags"
                    variant="faded"
                  />
                  <Input
                    classNames={inputSlots}
                    className="text-textPrimary my-2"
                    name="name"
                    value={spec?.dimensions}
                    onChange={(e) =>
                      setSpec({
                        ...spec,
                        dimensions: e.target.value,
                      })
                    }
                    size="lg"
                    label="Kích thước"
                    variant="faded"
                  />
                  <Input
                    classNames={inputSlots}
                    className="text-textPrimary my-2"
                    name="name"
                    value={spec?.materials}
                    onChange={(e) =>
                      setSpec({
                        ...spec,
                        materials: e.target.value,
                      })
                    }
                    size="lg"
                    label="Chất liệu"
                    variant="faded"
                  />
                </div>

                <div className="flex flex-row gap-5 mt-5">
                  <Button type="submit" color="primary">
                    <Save color="white" size={15} />
                    Lưu thông tin
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        ) : null}
      </div>

      {product && (
        <div className="mt-5">
          <h2
            className={twMerge(
              "text-textPrimary text-xl my-3",
              latoRegular.className
            )}
          >
            III. Hình ảnh sản phẩm
          </h2>
          {product?.images?.map((item, index) => (
            <div key={index} className="my-2">
              <AddingImageButton
                imageDefault={item}
                onCommitChange={({ image, color }) => {
                  setVariant(1);
                  confirmModal.onOpen();
                  confirmModalRef.current?.setOnConfirm(() =>
                    onCommitChangeUploadImage({ image, color }, index)
                  );
                }}
                onDelete={() => {
                  setVariant(0);
                  confirmModal.onOpen();
                  confirmModalRef.current?.setOnConfirm(() => {
                    onDeleteImageSource(item.url, index);
                    confirmModal.onClose();
                  });
                }}
                key={index}
              />
            </div>
          ))}
          {images.map((item, index) => (
            <div key={index} className="my-2">
              <AddingImageButton
                onDelete={() => onDeleteImageField(index)}
                onImagesUploadPreview={({ image, color }) =>
                  onImagesUploadPreview({ image, color }, index)
                }
                onCommitChange={({ image, color }) => {
                  setVariant(2);
                  onCommitChangeUploadImage(
                    { image, color },
                    index + (product?.images?.length ?? 0)
                  );
                }}
                key={index}
              />
            </div>
          ))}

          <Button
            className="my-3"
            onClick={() =>
              setImages([
                ...images,
                {
                  image: undefined,
                  color: "",
                },
              ])
            }
          >
            <p>Add images</p>
            <PlusCircle color="green"></PlusCircle>
          </Button>
        </div>
      )}

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
        variant={variant}
        ref={confirmModalRef}
        disclosure={confirmModal}
      >
        <></>
      </ModalConfirm>
    </div>
  );
};
