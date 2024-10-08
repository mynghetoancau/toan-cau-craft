"use client"
import { cormorantRegular } from "@/fonts";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export const CategoryCard = ({
  src,
  title,
  className,
  onClick
}: {
  src: string;
  title: string;
  className?: string;
  onClick?:() => void;
}) => {
  return (
    <button onClick={onClick} type="button" className="group">
      <div
        className={twMerge("relative h-96 overflow-hidden group", className)}
      >
        <Image
          className="absolute group-hover:scale-125 transition duration-300"
          fill
          objectFit="cover"
          src={src}
          alt="category_image"
        />
        <div className="w-full h-full absolute bg-vertical-gradient"></div>
        <div className="absolute p-5 group-hover:scale-95 transition-transform duration-300 w-full h-full">
          <div className="border w-full h-full flex items-end border-themeWhite p-6">
            <h4
              className={twMerge(
                cormorantRegular.className,
                "text-themeWhite text-4xl text-start"
              )}
            >
              {title}
            </h4>
          </div>
        </div>

        <div className="h-full w-full absolute group-hover:opacity-100 flex justify-center items-center opacity-0">
          <div className="rotate-45 w-8 h-8 bg-blurEffectWhite">
            <div className="w-5 h-5 bg-blurEffectGold"></div>
          </div>
        </div>
      </div>
    </button>
  );
};
