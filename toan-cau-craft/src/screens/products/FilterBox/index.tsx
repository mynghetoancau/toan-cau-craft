import React from "react";
import { cormorantSemiBold, latoRegular } from "@/fonts";
import { Button } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";

export const FilterBox = ({
  title,
  data,
  className,
  onCheck,
  chosen
}: {
  className?: string;
  title: string;
  data: {
    key:string
    value: string;
  }[];
  onCheck: (value: string) => void;
  chosen?: string
}) => {

  return (
    <div className={twMerge("", className)}>
      <h2
        className={twMerge(
          cormorantSemiBold.className,
          "text-textPrimary text-lg"
        )}
      >
        {title}
      </h2>

      <div className="mt-3">
        {data.map((item) => (
          <div key={item.value + "" +chosen} className="flex items-center">
            <Button
              className={twMerge("border-none", chosen == item.value ? "bg-default-200" : "bg-none")}
              onClick={() => {
                onCheck(item.value);
              }}
              variant="ghost"
              color={"default"}
              value={item.value}
            >
              <p
                className={twMerge(
                  latoRegular.className,
                  "text-textPrimary text-sm"
                )}
              >
                {item.key}
              </p>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
