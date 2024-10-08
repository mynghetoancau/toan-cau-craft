"use client"
import { ImageProduct } from "@/models/Product";
import { Button, Image, Input } from "@nextui-org/react";
import { PlusCircle, Save } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

export type ExportDataImage = {
  name?: string;
  image: File | undefined;
  color: string | null;
};

export type AddingImageProps = {
  onImagesUploadPreview?: ({ image, color, name }: ExportDataImage) => void;
  onDelete?: () => void;
  onCommitChange?: ({ image, color, name }: ExportDataImage) => void;
  imageDefault?: ImageProduct;
};

export const AddingImageButton = ({
  imageDefault,
  onImagesUploadPreview,
  onCommitChange,
  onDelete,
}: AddingImageProps) => {
  const [image, setImage] = useState<File>();
  const [name, setName] = useState<string>();
  const [preview, setPreview] = useState(imageDefault?.url ?? "");
  const [color, setColor] = useState(imageDefault?.color ?? "none");
  const [onChange, setOnChange] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);

  const fileInputRef = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const name = e.target.name[0];
      setOnChange(true);
      setImage(file);
      setName(name);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (onImagesUploadPreview != null) {
      onImagesUploadPreview({
        image: image,
        name: name,
        color: color,
      });
    }
  }, [color, image]);

  return (
    <div className="border-2 rounded-xl border-secondary-50 p-3 grid grid-cols-5">
      <div className="col-span-3">
        <input
          ref={fileInputRef}
          className="text-textPrimary"
          type="file"
          onChange={handleChange}
        />
        {preview && (
          <Image
            className="my-3"
            src={preview}
            alt="Image Preview"
            style={{ width: "auto", height: "300px" }}
          />
        )}
      </div>

      <div className="col-span-2">
        <h3 className="text-textPrimary my-3 font-semibold">
          Màu sắc của sản phẩm tương ứng với ảnh này (tuỳ chọn)
        </h3>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setOpenColorPicker(!openColorPicker);
              setOnChange(true);
              setColor(color === "none" ? "#bfa634" : color);
            }}
          >
            {color !== "none" ? (
              <div
                className="w-12 h-12 rounded-full pt-3"
                style={{ backgroundColor: color }}
              ></div>
            ) : (
              <PlusCircle color="green"></PlusCircle>
            )}
          </button>
          {color !== "none" ? (
            <div className="flex flex-col">
              <p className="text-textPrimary">mã màu (hex)</p>
              <Input
                size="sm"
                variant="faded"
                className="text-textPrimary"
                placeholder="#"
                onChange={(e) => {
                  setColor(e.target.value);
                }}
                value={color}
              ></Input>
            </div>
          ) : null}
          {color !== "none" ? (
            <button
              type="button"
              onClick={() => {
                setOnChange(true);
                setColor("none");
              }}
            >
              <p className="text-danger-500">Xoá</p>
            </button>
          ) : null}
        </div>
        {openColorPicker ? (
          <div className="absolute flex">
            <HexColorPicker
              color={color ?? "#34323f"}
              onChange={(c) => setColor(c)}
            />
          </div>
        ) : null}
      </div>

      {onChange && onCommitChange ? (
        <>
          <Button
            className="mr-5"
            onClick={() => {
              if (onCommitChange) {
                onCommitChange({
                  image: image,
                  name: name,
                  color: color,
                });
              }
            }}
            color="primary"
          >
            <Save color="white" size={15} />
            <p>Lưu thay đổi</p>
          </Button>
          <Button
            onClick={() => {
              setOnChange(false);
              setPreview(imageDefault?.url ?? "");
              clearFileInput();
              setOpenColorPicker(false);
              setColor(imageDefault?.color ?? "none");
            }}
            variant="faded"
            color="danger"
          >
            <p>Huỷ bỏ</p>
          </Button>
        </>
      ) : (
        <Button onClick={onDelete} variant="faded" color="danger">
          <p>Xoá hình ảnh</p>
        </Button>
      )}
    </div>
  );
};
