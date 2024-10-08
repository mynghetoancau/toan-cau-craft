import { firestore } from "@/utils/FireBase";
import { addDoc, collection, doc, getDocs, getDocsFromCache, updateDoc } from "firebase/firestore";

const COLLECTION_ID = "contactInfos"

export type ContactInfo = {
    id: string;
    phone: string;
    email: string;
    address: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
};


export type AddContactInfoProps = {
    contactInfo: {
        phone: string;
        email: string;
        address: string;
        facebook?: string;
        instagram?: string;
        youtube?: string;
    }
}

export type UpdateCategoryProps = {
    contactInfoId: string,
    contactInfo: {
        phone: string;
        email: string;
        address: string;
        facebook?: string;
        instagram?: string;
        youtube?: string;
    }
}

export const fetchContactInfo = async (): Promise<ContactInfo> => {

    try {
        const collectionSnap = await getDocsFromCache(collection(firestore, COLLECTION_ID));

        if (!collectionSnap.empty) {
            console.log("Load data from cache")
            const contactInfo: ContactInfo[] = collectionSnap.docs.map((doc) => ({
                id: doc.id,
                phone: doc.data().phone,
                email: doc.data().email,
                address: doc.data().address,
                facebook: doc.data().facebook,
                instagram: doc.data().instagram,
                youtube: doc.data().youtube,
            }));
            return contactInfo[0] || [];
        }
        console.log("Load data from server")
        const querySnapshot = await getDocs(collection(firestore, COLLECTION_ID));
        const contactInfo: ContactInfo[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            phone: doc.data().phone,
            email: doc.data().email,
            address: doc.data().address,
            facebook: doc.data().facebook,
            instagram: doc.data().instagram,
            youtube: doc.data().youtube,
        }));
        return contactInfo[0] || [];
    } catch (error) {
        console.error("Error fetching categories: ", error);
        throw new Error("Failed to fetch categories");
    }
};

export const addContactInfo = async ({ contactInfo }: AddContactInfoProps) => {
    try {
        const contact = await addDoc(collection(firestore, COLLECTION_ID), contactInfo);
        return { success: true, data: contact };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false, error: e };
    }
};

export const updateContactInfo = async ({ contactInfoId, contactInfo }: UpdateCategoryProps) => {
    try {
        const contactInfoDocRef = doc(firestore, COLLECTION_ID, contactInfoId);
        await updateDoc(contactInfoDocRef, { ...contactInfo });

        return { success: true, data: contactInfoDocRef };
    } catch (e) {
        console.error("Error update document: ", e);
        return { success: false, error: e };
    }
};