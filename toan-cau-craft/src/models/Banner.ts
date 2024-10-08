import { firestore, storage } from "@/utils/FireBase";
import { addDoc, clearIndexedDbPersistence, collection, deleteDoc, doc, getDoc, getDocFromCache, getDocs, getDocsFromCache, query, updateDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const COLLECTION_ID = "banners"

export type Banner = {
    id: string;
    type: string;
    url: string;
};


export type UpdateBannerProps = {
    bannerId: string,
    bannner: {
        type: string;
        url: string;
    }
}

export const fetchBanner = async (): Promise<Banner[]> => {

    try {
        const collectionSnap = await getDocsFromCache(collection(firestore, COLLECTION_ID));

        if (!collectionSnap.empty) {
            console.log("Load data from cache")
            const banners: Banner[] = collectionSnap.docs.map((doc) => ({
                id: doc.id,
                type: doc.data().type,
                url: doc.data().url,
            }));
            return banners;
        }
        console.log("Load data from server")
        const querySnapshot = await getDocs(collection(firestore, COLLECTION_ID));
        const banners: Banner[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            type: doc.data().type,
            url: doc.data().url,
        }));
        return banners;
    } catch (error) {
        console.error("Error fetching categories: ", error);
        throw new Error("Failed to fetch categories");
    }
};

export const updateBanner = async ({ bannerId, bannner }: UpdateBannerProps) => {
    try {
        const bannerRef = doc(firestore, COLLECTION_ID, bannerId);
        await updateDoc(bannerRef, { ...bannner });

        return { success: true, data: bannerRef };
    } catch (e) {
        console.error("Error update document: ", e);
        return { success: false, error: e };
    }
};

export const getBannerByType = async (type: string) => {
    try {
        const collectionSnap = await getDocsFromCache(collection(firestore, COLLECTION_ID));

        if (!collectionSnap.empty) {
            console.log("Load data from cache")
            const banners: Banner[] = collectionSnap.docs.map((doc) => ({
                id: doc.id,
                type: doc.data().type,
                url: doc.data().url,
            }));
            
            const banner = banners.find(b => b.type === type)?.url;
            if(banner) {
                return { success: true, data: banner };
            }
        }
        console.log("Load data from server")
        const bannersRef = collection(firestore, COLLECTION_ID); // Replace "banners" with your actual collection ID
        const q = query(bannersRef, where("type", "==", type));

        const querySnapshot = await getDocs(q);
        const banners = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        if (banners.length > 0) {
            return { success: true, data: banners[0] }; // Assuming you want the first result
        } else {
            return { success: false, error: "No banner found for this type" };
        }
    } catch (e) {
        console.error("Error getting document: ", e);
        return { success: false, error: e };
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
        const storageRef = ref(storage, `banners/${uuidv4()}`);
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