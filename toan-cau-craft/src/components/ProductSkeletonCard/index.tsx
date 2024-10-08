import React from "react";
import {Skeleton } from "@nextui-org/react";

export const ProductSkeletonCard = () => {
  return (
    <button>
      <div className=" relative w-full overflow-hidden rounded-lg py-3">
        <div className="relative flex h-full">
          <Skeleton className=" w-10/12 rounded-lg">
            <div className="min-h-80 w-full" />
          </Skeleton>
        </div>
      </div>
      <div className="space-y-3 mt-4">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
    </button>
  );
};
