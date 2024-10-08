import React from "react";
import { cormorantMedium, latoRegular } from "@/fonts";
import { Image } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";

type ProductCardProps = {
  src: string;
  category: string;
  name: string;
  className?: string;
  onClick?:() => void;
};

export const ProductCard = ({
  src,
  category,
  name,
  className,
  onClick
}: ProductCardProps) => {
  return (
    <button onClick={onClick} type="button" className={twMerge("group relative rounded-lg p-3 hover:bg-anitiqueWhite", className)}>
      <div className=" relative w-full overflow-hidden rounded-lg">
        <div className="relative  h-full">
          <img src={src} className="min-h-80 w-full " alt="product image"  />
        </div>
        <div className="w-32 h-32 scale-0 group-hover:scale-100 transition duration-300 bg-themeWhite -top-16 -right-16 rounded-full absolute z-10 flex">
        </div>
        <p
          className={twMerge(
            latoRegular.className,
            "text-textSecondary text-xs text-left z-20 absolute top-0 right-0 m-4 opacity-0 group-hover:opacity-100 transition duration-500"
          )}
        >
          View {">"}
        </p>
      </div>
      <div className="mt-4">
        <p
          className={twMerge(
            cormorantMedium.className,
            "text-textPrimary text-xl text-left"
          )}
        >
          {name}
        </p>
        <p
          className={twMerge(
            latoRegular.className,
            "text-textSecondary text-sm text-left"
          )}
        >
          {category}
        </p>
      </div>
    </button>
  );
};
