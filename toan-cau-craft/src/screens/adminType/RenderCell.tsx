"use client";
import { Type} from "@/models/Type";
import { Tooltip } from "@nextui-org/react";
import { Delete, Edit, Eye } from "lucide-react";
import React from "react";

interface Props {
  type: Type;
  columnKey: string | React.Key;
  onClickDelete: (id:string) => void;
  onClickEdit: (item: Type) => void;
}

export const renderCell = ({ type, columnKey, onClickDelete, onClickEdit }: Props) => {
  switch (columnKey) {
    case "name": {
      const valueCate = type[columnKey] + "";
      return (
        <div className="flex flex-col">
          <p className="text-textPrimary text-xl">{valueCate}</p>
        </div>
      );
    }
    case "actions":
      return (
        <div className="relative flex items-center justify-center gap-2">
          {/* <Tooltip color="success" content="Xem chi tiết">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <Eye color="red" />
            </span>
          </Tooltip> */}
          <Tooltip color="success" content="Chỉnh sửa sản phẩm">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => onClickEdit(type)}>
              <Edit color="green" />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Xoá sản phẩm">
            <span
              onClick={() => onClickDelete(type.id)}
              className="text-lg text-danger cursor-pointer active:opacity-50"
            >
              <Delete />
            </span>
          </Tooltip>
        </div>
      );
    default:
      return (
        <div className="flex flex-col">
          <p className="text-textPrimary">
            {type[columnKey as keyof Type]}
          </p>
        </div>
      );
  }
};
