"use client"
import { ImageProduct } from "@/models/Product";
import { Button, Image, Input } from "@nextui-org/react";
import { PlusCircle, Save } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

export type ExportDataImage = {
  name: string | undefined;
  image: File | undefined;
};

export type AddingImageProps = {
  onImagesUploadPreview?: ({ image, name }: ExportDataImage) => void;
  onDelete?: () => void;
  onCommitChange?: ({ image, name }: ExportDataImage) => void;
  imageDefault?: string;
};

export const AddingImageButton = ({
  imageDefault,
  onImagesUploadPreview,
  onCommitChange,
  onDelete,
}: AddingImageProps) => {
  const [image, setImage] = useState<File>();
  const [name, setName] = useState<string>();
  const [preview, setPreview] = useState(imageDefault);
  const [onChange, setOnChange] = useState(false);

  
  const fileInputRef = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const name = e.target.files[0].name;
      
      setOnChange(true);
      setImage(file);
      setName(name);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      (fileInputRef.current as any).value = "";
    }
  };

  useEffect(() => {
    setPreview(imageDefault)
  }, [imageDefault])

  useEffect(() => {
    if (onImagesUploadPreview != null) {
      onImagesUploadPreview({
        image: image,
        name: name,
      });
    }
  }, [name, image]);
  

  return (
    <div className="border-2 rounded-xl border-secondary-50 p-3 grid grid-cols-5 mt-4">
      <div className="col-span-3">
        <Input
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

    </div>
  );
};
