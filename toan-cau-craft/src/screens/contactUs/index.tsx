"use client";
import React, { useEffect, useState } from "react";
import { ButtonApp } from "@/components";
import { TopBanner } from "@/components/TopBanner";
import { cormorantSemiBold, latoRegular } from "@/fonts";
import { Icons } from "@/icons";
import { Input, Textarea } from "@nextui-org/react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { sendMail } from "@/utils/Gmail";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { ContactInfo, fetchContactInfo } from "@/models/ContactInfo";
import { getBannerByType } from "@/models/Banner";

interface IForm {
  message: string
  email: string
  name: string
}

export const ContactUs = (): React.JSX.Element => {
  const EMAIL = "laingoclamdev@gmail.com"

  const [form, setForm] = useState<IForm>({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>();
  const [banner, setBanner] = useState<string>('/images/contact-us.png');

  const getBanner = async () => {
    const data = await getBannerByType('product') as any;
    setBanner(data?.data?.url || "/images/contact-us.png");
  }

  useEffect(() => {
    getBanner();
    getContactInfo();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const resetForm = () => {
    setForm({ name: '', email: '', message: '' });
  }

  const handleSendMail = async () => {
    try {
      if (form.email && form.name && form.message) {
        setIsLoading(true);
        await sendMail({
          sendTo: EMAIL,
          subject: 'NEW MESSAGE FROM WEBSITE TOAN CAU',
          html: `
            <p>You have received a new message from <strong>${form.name}</strong> (${form.email}):</p>
            <p>${form.message}</p>
          `
        });
        setIsLoading(false);
        resetForm();
        toast.success("Please check your mail");
      }
    } catch (error) {
      console.error('error', error);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  }

  const getContactInfo = async () => {
    const res = await fetchContactInfo();
    setContactInfo(res);
  }

  return (
    <div className="md:px-8 lg:px-16">
      <TopBanner
        src={banner}
        h1="Handicraft"
        h2="MADE WITH LOVE"
        description="Lorem ipsum dolor sit amet consectetur. Tempor faucibus sit iaculis arcu felis. Volutpat sollicitudin tortor aliquam maecenas porttitor ac et blandit. Pretium urna at ac purus aliquet mauris. Sit feugiat mattis turpis congue justo."
      />
      <div className="flex justify-center py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 bg-themeWhite rounded-3xl overflow-hidden shadow-lg w-full max-w-6xl">
          <div className="col-span-1 md:col-span-2 bg-[url('/images/contact_us_side.png')] bg-cover bg-center">
            <div className="pt-16 px-6 pb-8 md:pt-32 md:px-10 md:pb-11 bg-blurEffect">
              <div className="flex flex-col items-center">
                <Image
                  src="/images/logo.svg"
                  className="size-16"
                  width={200}
                  height={200}
                  alt="logo"
                />
                <p className={twMerge(latoRegular.className, "text-themeWhite mt-6 text-sm text-center")}>
                  Crafting the essence of nature into timeless art, one handcrafted piece at a time.
                </p>
              </div>
              <div className="flex flex-col gap-5 mt-10">
                {contactInfo && (
                  <>
                    <div className="flex items-center gap-3">
                      <Image src={Icons.Phone} alt="phone icon" />
                      <p className={twMerge(latoRegular.className, "text-themeWhite text-sm")}>
                        {contactInfo.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Image src={Icons.Mail1} alt="mail icon" />
                      <p className={twMerge(latoRegular.className, "text-themeWhite text-sm")}>
                        {contactInfo.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Image src={Icons.MarkerPin} alt="location icon" />
                      <p className={twMerge(latoRegular.className, "text-themeWhite text-sm")}>
                        {contactInfo.address}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="text-themeWhite flex flex-row items-center mt-10">
                <div className="bg-themeWhite w-10 h-px mr-1"></div>
                <p className={twMerge(latoRegular.className, "text-base")}>CONTACT NOW</p>
              </div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-3 bg-themeWhite">
            <div className="m-6 md:m-11">
              <h1 className={twMerge(cormorantSemiBold.className, "text-textPrimary text-4xl md:text-6xl my-3")}>
                Contact us
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputItem label="Name" placeHolder="Enter your name" name="name" value={form.name} onChange={handleFormChange} />
                <InputItem label="Email" placeHolder="Enter your email" name="email" value={form.email} onChange={handleFormChange} />
                <AreaInputItem label="Message" placeHolder="Enter your message" name="message" value={form.message} onChange={handleFormChange} />
              </div>
              <Button
                className="bg-themeDark rounded-lg text-themeWhite font-light mt-12 text-[15px] w-full"
                onClick={handleSendMail}
                isLoading={isLoading}
                spinner={
                  <svg
                    className="animate-spin h-5 w-5 text-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    />
                  </svg>
                }
              >
                {isLoading ? "LOADING" : "SEND MESSAGE"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputItem = ({
  label,
  placeHolder,
  onChange,
  name,
  value
}: {
  label: string;
  placeHolder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Input
      classNames={{
        label: "text-textSecondary mb-5",
        base: "bg-black",
        input: "placeholder:text-textTertiary",
        description: "text-textTertiary",
      }}
      className={twMerge("w-full", latoRegular.className)}
      type="text"
      variant={"underlined"}
      label={label}
      placeholder={placeHolder}
      onChange={onChange}
      name={name}
      value={value}
    />
  );
};

const AreaInputItem = ({
  label,
  placeHolder,
  onChange,
  name,
  value
}: {
  label: string;
  placeHolder: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <Textarea
      classNames={{
        label: "text-textSecondary mb-5",
        base: "bg-black flex gap-5",
        input: "placeholder:text-textTertiary",
        description: "text-textTertiary",
      }}
      className={twMerge("col-span-2", latoRegular.className)}
      type="text"
      variant={"underlined"}
      label={label}
      placeholder={placeHolder}
      onChange={onChange}
      name={name}
      value={value}
    />
  );
};