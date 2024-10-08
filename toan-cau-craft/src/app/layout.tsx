"use client";
import React from "react";
import { leagueSpartanRegular } from "@/fonts";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import { Providers } from "./provider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          leagueSpartanRegular.className,
          "flex min-h-screen flex-col items-center justify-between bg-themeWhite"
        )}
      >
        <ToastContainer />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
