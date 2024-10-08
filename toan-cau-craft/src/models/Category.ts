import { firestore, storage } from "@/utils/FireBase";
import { addDoc, clearIndexedDbPersistence, collection, deleteDoc, doc, getDoc, getDocFromCache, getDocs, getDocsFromCache, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const COLLECTION_ID = "categories"

export type Category = {
  id: string;
  name: string;
  image: string;
  slug: string;
};

export const columns = [
  { name: "ID", uid: "id" },
  { name: "Name", uid: "name" },
  { name: "Slug", uid: "slug" },
  { name: "Action", uid: "actions" },
];

export type AddCategoryProps = {
  category: {
    name: string
    slug: string;
    image: string;
  }
}

export type UpdateCategoryProps = {
  categoryId: string,
  category: {
    name: string
    slug: string;
    image: string;
  }
}

export const fetchCategories = async (): Promise<Category[]> => {

  try {
    const collectionSnap = await getDocsFromCache(collection(firestore, COLLECTION_ID));

    if (!collectionSnap.empty) {
      console.log("Load data from cache")
      const categories: Category[] = collectionSnap.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        image: doc.data().image,
        slug: doc.data().slug,
      }));
      return categories;
    }
    console.log("Load data from server")
    const querySnapshot = await getDocs(collection(firestore, COLLECTION_ID));
    const categories: Category[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      image: doc.data().image,
      slug: doc.data().slug,
    }));
    return categories;
  } catch (error) {
    console.error("Error fetching categories: ", error);
    throw new Error("Failed to fetch categories");
  }
};

export const addCategory = async ({ category }: AddCategoryProps) => {
  try {
    const categoryDoc = await addDoc(collection(firestore, COLLECTION_ID), category);
    return { success: true, data: categoryDoc };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e };
  }
};

export const updateCategory = async ({ categoryId, category }: UpdateCategoryProps) => {
  try {
    const categoryDocRef = doc(firestore, COLLECTION_ID, categoryId);
    await updateDoc(categoryDocRef, {...category});

    return { success: true, data: categoryDocRef };
  } catch (e) {
    console.error("Error update document: ", e);
    return { success: false, error: e };
  }
};

export const deleteaddCategoryByIds = async (ids: string) => {
  try {
    await deleteDoc(doc(firestore, COLLECTION_ID, ids));
    return { success: true };
  } catch (error) {
    console.error('Error deleting documents:', error);
    return { success: false, error: error };
  }
};

export const handleUploadImage = async ({
  image,
  name
}: {
  name: string,
  image: File | undefined;
}): Promise<string> => {
  let result = '';
  try {
    const imageCategory = await uploadImage({
      name: name,
      image: image
    });
    result = imageCategory
  } catch (error) {
    console.error(`Error uploading image:`, error);
  }
  return result;
};

export const uploadImage = (image: {
  image: File | undefined;
  name: string;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!image.image) {
      reject(new Error("Image file is undefined"));
      console.log("empty");
      return;
    }
    console.log("uploading");
    const storageRef = ref(storage, `categories/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(storageRef, image.image);

    uploadTask.on(
      "state_changed",
      () => { },
      (error) => {
        console.error(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
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