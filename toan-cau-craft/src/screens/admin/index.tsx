"use client";
import React, { useEffect, useState } from "react";
import { Input, Button, useDisclosure, Textarea } from "@nextui-org/react";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { fetchContactInfo, updateContactInfo } from "@/models/ContactInfo";
import ModalCommon from "@/components/Modals/ModalCommon";
import Lottie from "react-lottie";
import { LottieApp } from "@/utils/lotties";
import Image from "next/image";
import { Icons } from "@/icons";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import EditBanner from "./EditBanner";

type ContactInfo = {
  id: string;
  phone: string;
  email: string;
  address: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
};

export const Admin = (): React.JSX.Element => {
  const router = useRouter();
  const responseModal = useDisclosure();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>();
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const [contactInfo, setContactInfo] = useState<ContactInfo>();

  const resetState = () => {
    setIsLoading(false);
    setResponseMessage("Vui lòng đợi...");
  };

  const getContactInfo = async () => {
    const res = await fetchContactInfo();
    setContactInfo(res);
    formik.setValues({
      phone: res.phone || "",
      email: res.email || "",
      address: res.address || "",
      facebook: res.facebook || "",
      instagram: res.instagram || "",
      youtube: res.youtube || "",
      id: res.id,
    })
  }

  useEffect(() => {
    getContactInfo();
  }, [])

  const formik = useFormik({
    initialValues: {
      phone: contactInfo?.phone || "",
      email: contactInfo?.email || "",
      address: contactInfo?.address || "",
      facebook: contactInfo?.facebook || "",
      instagram: contactInfo?.instagram || "",
      youtube: contactInfo?.youtube || "",
    } as ContactInfo,
    validationSchema: Yup.object({
      phone: Yup.string().matches(/^\d+$/, "Số điện thoại chỉ được chứa số")
        .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
        .max(11, "Số điện thoại chỉ được có tối đa 11 chữ số")
        .required("Số điện thoại là bắt buộc"),
      email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
      address: Yup.string().required("Địa chỉ là bắt buộc"),
      facebook: Yup.string().url("Link Facebook không hợp lệ"),
      instagram: Yup.string().url("Link Instagram không hợp lệ"),
      youtube: Yup.string().url("Link YouTube không hợp lệ"),
    }),
    onSubmit: async (
      values: ContactInfo,
      { setSubmitting }: FormikHelpers<ContactInfo>
    ) => {
      responseModal.onOpen();
      setIsLoading(true);
      updateContactInfo({
        contactInfo: {
          address: values.address,
          email: values.email,
          phone: values.phone,
          facebook: values.facebook,
          instagram: values.instagram,
          youtube: values.youtube
        },
        contactInfoId: values.id
      }).then(data => {
        if (data.data) {
          setIsLoading(false);
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
      })
      setSubmitting(false);
    }
  });
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <EditBanner/>
      <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Thông Tin Admin</h1>

        <div className="mb-4">
          <Input
            variant="faded"
            className="text-textPrimary"
            label="Số Điện Thoại"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            placeholder="Nhập số điện thoại"
            endContent={
              (
                <div className="h-full flex items-center">
                  <Phone />
                </div>
              )
            }
            errorMessage={formik.touched.phone && formik.errors.phone}
            isInvalid={formik.touched.phone && formik.errors.phone ? true : false}
          />
        </div>

        <div className="mb-4">
          <Input
            variant="faded"
            className="text-textPrimary"
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Nhập email"
            errorMessage={formik.touched.email && formik.errors.email}
            isInvalid={formik.touched.email && formik.errors.email ? true : false}
            endContent={
              (
                <div className="h-full flex items-center">
                  <Mail />
                </div>
              )
            }
          />
        </div>

        <div className="mb-4">
          <Textarea
            variant="faded"
            className="text-textPrimary"
            label="Địa Chỉ"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            placeholder="Nhập địa chỉ"
            errorMessage={formik.touched.address && formik.errors.address}
            isInvalid={formik.touched.address && formik.errors.address ? true : false}
            endContent={
              (
                <div className="h-full flex items-center">
                  <MapPin />
                </div>
              )
            }
          />
        </div>

        <div className="mb-4">
          <Input
            variant="faded"
            className="text-textPrimary"
            label="Link Facebook"
            name="facebook"
            value={formik.values.facebook}
            onChange={formik.handleChange}
            placeholder="Nhập link Facebook"
            errorMessage={formik.touched.facebook && formik.errors.facebook}
            isInvalid={formik.touched.facebook && formik.errors.facebook ? true : false}
            endContent={
              (
                <div className="h-full flex items-center">
                  <Image src={Icons.FaceBookIcon} alt="facebook icon" />
                </div>
              )
            }
          />
        </div>

        <div className="mb-4">
          <Input
            variant="faded"
            className="text-textPrimary"
            label="Link Instagram"
            name="instagram"
            value={formik.values.instagram}
            onChange={formik.handleChange}
            placeholder="Nhập link Instagram"
            errorMessage={formik.touched.instagram && formik.errors.instagram}
            isInvalid={formik.touched.instagram && formik.errors.instagram ? true : false}
            endContent={
              (
                <div className="h-full flex items-center">
                  <Image src={Icons.InstagramIcon} alt="instagram icon" />
                </div>
              )
            }
          />
        </div>

        <div className="mb-4">
          <Input
            variant="faded"
            className="text-textPrimary"
            label="Link YouTube"
            name="youtube"
            value={formik.values.youtube}
            onChange={formik.handleChange}
            placeholder="Nhập link YouTube"
            errorMessage={formik.touched.youtube && formik.errors.youtube}
            isInvalid={formik.touched.youtube && formik.errors.youtube ? true : false}
            endContent={
              (
                <div className="h-full flex items-center">
                  <Image src={Icons.YoutubeIcon} alt="youtube icon" />
                </div>
              )
            }
          />
        </div>

        <Button type="submit" className="w-full" color="primary">
          Cập nhật
        </Button>
      </form>

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
