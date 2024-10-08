"use client"
import { Icons } from "@/icons";
import { Images } from "@/images";
import { useAppSelector } from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { latoRegular, leagueSpartanRegular } from "@/fonts";
import { twMerge } from "tailwind-merge";
import { ContactInfo, fetchContactInfo } from "@/models/ContactInfo";

type FooterProp = {};

export const Footer = ({ }: FooterProp): React.JSX.Element => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>();
  const getContactInfo = async () => {
    const res = await fetchContactInfo();
    setContactInfo(res);
  }

  useEffect(() => {
    getContactInfo();
  }, [])
  return (
    <div className="flex p-5 flex-col gap-10 border-t border-backgroundDecor200 mt-10">
      <div className="grid sm:grid-cols-4 gap-16">
        <div className="col-span-1">
          <Image
            src="/images/logo.svg"
            className="size-16"
            width={200}
            height={200}
            alt="logo"
          />
          <p className={twMerge(latoRegular.className, "text-textSecondary mt-6 text-sm")}>
            “Crafting the essence of nature into timeless art, one handcrafted
            piece at a time.”
          </p>
        </div>

        <div className="col-span-2">
          <div className="flex flex-col gap-5">
            <p className={twMerge(latoRegular.className, "text-textPrimary text-sm")}>
              Contact us
            </p>
            <div className="flex gap-3">
              <Image src={Icons.Phone} alt="phone icon" />
              <p
                className={twMerge(latoRegular.className, "text-textSecondary text-sm")}
              >
                {contactInfo?.phone || ''}
              </p>
            </div>
            <div className="flex gap-3">
              <Image src={Icons.Mail1} alt="phone icon" />
              <p
                className={twMerge(latoRegular.className, "text-textSecondary text-sm")}
              >
                {contactInfo?.email || ''}
              </p>
            </div>
            <div className="flex gap-3">
              <Image src={Icons.MarkerPin} alt="phone icon" />
              <p
                className={twMerge(latoRegular.className, "text-textSecondary text-sm")}
              >
                {contactInfo?.address || ''}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="flex flex-col gap-5">
            <p className={twMerge(latoRegular.className, "text-textPrimary text-sm")}>
              Follow us
            </p>
            <div className="flex gap-3">
              <p
                className={twMerge(latoRegular.className, "text-textSecondary text-sm")}
              >
                Follow us on our social media platforms to stay connected and
                discover the latest in our handcrafted collections!
              </p>
            </div>
            <div className="flex gap-6">
              <Link href={contactInfo?.facebook || "#"}>
                <Image src={Icons.FaceBookIcon} alt="facebook icon" />
              </Link>
              <Link href={contactInfo?.instagram || "#"}>
                <Image src={Icons.InstagramIcon} alt="instagram icon" />
              </Link>
              <Link href={contactInfo?.youtube || "#"}>
                <Image src={Icons.YoutubeIcon} alt="youtube icon" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 1 }} className="bg-backgroundDecor500 w-full"></div>

      <div className="flex justify-end mb-10">
        <p
          className={twMerge(
            latoRegular.className,
            "text-textSecondary text-xs"
          )}
        >
          Copyright 2024 GLOBAL HANDICRAFTS CO.,LTD. All Rights Reserved.
        </p>
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
}) => {
  return (
    <Link
      className={"m-5 text-textPrimary" + (isCurrent ? " border-b" : "")}
      href={href}
    >
      <p className={leagueSpartanRegular.className}>{title}</p>
    </Link>
  );
};
