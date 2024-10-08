import { firestore } from "@/utils/FireBase";
import { addDoc, collection, deleteDoc, doc, getDocs, getDocsFromCache, onSnapshot, updateDoc } from "firebase/firestore";

const COLLECTION_ID = "types"

export type Type = {
  id: string;
  name: string;
  slug: string;
};

export const columns = [
    { name: "ID", uid: "id" },
    { name: "Name", uid: "name" },
    { name: "Slug", uid: "slug" },
    { name: "Action", uid: "actions" },
  ];

  export type AddTypeProps ={
    type: {
        name: string
        slug: string;
    }
  }
  export type UpdateTypeProps ={
    type: {
        name: string
        slug: string;
    },
    typeId: string
  }

export const fetchTypes = async (): Promise<Type[]> => {
  try {
    const collectionSnap = await getDocsFromCache(collection(firestore, COLLECTION_ID));
    
    if(!collectionSnap.empty){
      console.log("Load data from cache")
      const types: Type[] = collectionSnap.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        slug: doc.data().slug,
      }));
      return types;
    }
    console.log("Load data from server")
    const querySnapshot = await getDocs(collection(firestore, "types"));
    const types: Type[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      slug: doc.data().slug,
    }));
    return types;
  } catch (error) {
    console.error("Error fetching types: ", error);
    throw new Error("Failed to fetch types");
  }
};

export const subscribeToTypesChanges = (callback: (types: Type[]) => void) => {
  const q = collection(firestore, COLLECTION_ID);

  // Bước 3: Dùng onSnapshot để tự động cập nhật cache khi có thay đổi từ server
  onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
    const types: Type[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      slug: doc.data().slug,
    }));
    
    // Gọi callback để trả về dữ liệu mới
    callback(types);

    // Kiểm tra nguồn dữ liệu (cache hay server)
    const source = snapshot.metadata.fromCache ? "local cache" : "server";
    console.log("Data came from " + source);
  });
};


export const addType = async ({ type }: AddTypeProps) => {
    try {
      const typeDoc = await addDoc(collection(firestore, COLLECTION_ID), type);
      return { success: true, data: typeDoc };
    } catch (e) {
      console.error("Error adding document: ", e);
      return { success: false, error: e };
    }
  };

  export const updateType = async ({ typeId, type }: UpdateTypeProps) => {
    try {
      const typeDocRef = doc(firestore, COLLECTION_ID, typeId);
      await updateDoc(typeDocRef, {...type});
  
      return { success: true, data: typeDocRef };
    } catch (e) {
      console.error("Error update document: ", e);
      return { success: false, error: e };
    }
  };

  export const deleteaddTypeByIds = async (ids:string) => {
    try {
     await deleteDoc(doc(firestore, COLLECTION_ID, ids))
      return { success: true};
    } catch (error) {
      console.error('Error deleting documents:', error);
      return { success: false, error: error};
    }
  };