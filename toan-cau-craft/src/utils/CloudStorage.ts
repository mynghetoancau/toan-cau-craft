import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "./FireBase";
import { ExportDataImage } from "@/screens/adminProductAddNew/AddingImageButton";
import { ImageProduct } from "@/models/Product";
import { v4 as uuidv4 } from "uuid";

interface HandleUploadImageProps {
  images: ExportDataImage[];
}

export const handleUploadImage = async ({
  images,
}: HandleUploadImageProps): Promise<ImageProduct[]> => {
  const imageProductArray = [];
  for (let i = 0; i < images.length; i++) {
    try {
      const imageProduct = await uploadImage(images[i]);
      imageProductArray.push(imageProduct);
    } catch (error) {
      console.error(`Error uploading image ${i}:`, error);
    }
  }
  return imageProductArray;
};

export const uploadImage = (image: ExportDataImage): Promise<ImageProduct> => {
  return new Promise((resolve, reject) => {
    if (!image.image) {
      reject(new Error("Image file is undefined"));
      console.log("empty");
      return;
    }
    console.log("uploading");
    const storageRef = ref(storage, `products/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(storageRef, image.image);

    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        console.error(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve({
            color: image.color,
            url: downloadURL,
          });
        });
      }
    );
  });
};

export const deleteImage = (imageUrl: string): Promise<void> => {
  console.log(imageUrl);

  return new Promise((resolve, reject) => {
    // Create a reference to the file to delete
    const storageRef = ref(storage, imageUrl);

    // Delete the file
    deleteObject(storageRef)
      .then(() => {
        console.log("File deleted successfully");
        resolve();
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
        reject(error);
      });
  });
};
