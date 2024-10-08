import { firestore } from "@/utils/FireBase"
import { Category } from "./Category"
import { Type } from "./Type"
import { addDoc, collection, deleteDoc, doc, DocumentReference, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { deleteImage } from "@/utils/CloudStorage"

const COLLECTION_ID = "products"

export type Product = {
    id?:string,
    name?:string,
    category?: Category
    slug?: string
    description?: string
    specification?: Specification
    type?: Type
    status?: Status
    images?: ImageProduct[]
    updateAt?: string,
    createAt?: string
}

export type Specification = {
  sku?: string,
  tags?: string,
  dimensions?: string,
  materials?: string
}

export type ProductImport = {
    id?:string,
    name?:string,
    category?: string
    slug?: string
    description?: string
    type?: string
    specification?: Specification
    status?: Status
    images?: ImageProduct[]
    updateAt?: string,
    createAt?: string
}

export type ImageProduct ={
    color:string | null
    url:string
}

export type Status = "active" | "pause"

export const columns = [
    { name: "ID", uid: "id" },
    { name: "Name", uid: "name" },
    { name: "Category", uid: "category" },
    { name: "Type", uid: "type" },
    { name: "status", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
  ];

  export type AddProductProps = {
    product: ProductImport
  }

  export type UpdateProductProps = {
    productId: string,
    product: ProductImport
  }

  export const addProducts = async ({ product }: AddProductProps) => {
    try {
      // Check for duplicate product name
      const productsRef = collection(firestore, "products");
      const querySnapshot = await getDocs(query(productsRef, where("name", "==", product.name)));
      
      if (!querySnapshot.empty) {
        throw new Error("Đã có một sản phẩm dùng tên này rồi (Không được trùng tên)");
      }
  
      // Create references to the category and type documents
      const categoryRef: DocumentReference = doc(firestore, "categories", product.category ?? "");
      const typeRef: DocumentReference = doc(firestore, "types", product.type ?? "");
  
      // Include the category and type references in the product data
      const productWithCategoryRef = {
        ...product,
        category: categoryRef,
        type: typeRef
      };
  
      // Add the new product to Firestore
      const docRef = await addDoc(collection(firestore, "products"), productWithCategoryRef);
      return { success: true, data: docRef };
    } catch (e) {
      console.error("Error adding product: ", e);
      return { success: false, error: e };
    }
  };

  export const updateProduct = async ({ productId, product }: UpdateProductProps) => {
    try {
      // Create references to the category and type documents
      const categoryRef: DocumentReference = doc(firestore, "categories", product.category ?? "");
      const typeRef: DocumentReference = doc(firestore, "types", product.type ?? "");
  
      // Include the category and type references in the product data
      const productWithRefs = {
        ...product,
        category: categoryRef,
        type: typeRef,
      };
  
      // Update the product document
      const productDocRef = doc(firestore, "products", productId);
      await updateDoc(productDocRef, productWithRefs);
  
      return { success: true, data: productDocRef };
    } catch (e) {
      console.error("Error updating product: ", e);
      return { success: false, error: e };
    }
  };


  export const updateProductImage = async ({ productId, product }: UpdateProductProps) => {
    try {
      // Update the product document
      const productDocRef = doc(firestore, "products", productId);
      await updateDoc(productDocRef, product);
  
      return { success: true, data: productDocRef };
    } catch (e) {
      console.error("Error updating product: ", e);
      return { success: false, error: e };
    }
  };

 export interface FetchProductsParams {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    name?: string;
  }

  interface FetchProductsResult {
    products: Product[];
    totalPages: number;
    totalDocs: number
  }

  export const fetchProducts = async ({
    page = 1,
    limit = 10,
    category,
    type,
    name,
  }: FetchProductsParams): Promise<FetchProductsResult> => {
    try {
      let productsQuery = query(collection(firestore, COLLECTION_ID));
  
      if (category) {
        const categoryDocRef = doc(firestore, "categories", category);
        productsQuery = query(productsQuery, where("category", "==", categoryDocRef));
      }
      if (type) {
        const typeDocRef = doc(firestore, "types", type);
        productsQuery = query(productsQuery, where("type", "==", typeDocRef));
      }
    if (name) {
      const startName = name;
      const endName = name + '\uf8ff'; // '\uf8ff' is a high Unicode character that comes after any other character
      productsQuery = query(productsQuery, where("name", ">=", startName), where("name", "<=", endName));
    }
  
      const querySnapshot = await getDocs(productsQuery);
      const totalDocs = querySnapshot.docs.length;
      const totalPages = Math.ceil(totalDocs / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = Math.min(startIndex + limit, totalDocs);
  
      const products: Product[] = await Promise.all(
        querySnapshot.docs.slice(startIndex, endIndex).map(async (productDoc) => {
          const productData = productDoc.data() as Product;
  
          const categoryDoc = await getDoc(doc(firestore, "categories", productData.category?.id ?? ""));
          const typeDoc = await getDoc(doc(firestore, "types", productData.type?.id ?? ""));
          return {
            ...productData,
            id: productDoc.id,
            type: typeDoc.data() as Type,
            category: categoryDoc.data() as Category,
          };
        })
      );
  
      return { products, totalPages, totalDocs };
    } catch (error) {
      console.error("Error fetching products: ", error);
      throw new Error("Failed to fetch products");
    }
  };
  

  export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
    try {
      const q = query(collection(firestore, "products"), where("slug", "==", slug));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return null;
      }
  
      const productDoc = querySnapshot.docs[0];
      const productData = productDoc.data() as Product;
  
      const categoryDoc = await getDoc(doc(firestore, "categories", productData.category?.id ?? ""));
      const typeDoc = await getDoc(doc(firestore, "types", productData.type?.id ?? ""));
  
      return {
        ...productData,
        id: productDoc.id,
        category: { id: categoryDoc.id, ...categoryDoc.data() } as Category,
        type: { id: typeDoc.id, ...typeDoc.data() } as Type,
      };
    } catch (error) {
      console.error("Error fetching product by slug: ", error);
      throw new Error("Failed to fetch product by slug");
    }
  };

  export const deleteProduct = async (productId: string): Promise<void> => {
    try {
      // Fetch the product document
      const productDoc = await getDoc(doc(firestore, COLLECTION_ID, productId));
      if (!productDoc.exists()) {
        throw new Error("Product not found");
      }
  
      const productData = productDoc.data() as Product;
  
      // Delete associated images
      if (productData.images && productData.images.length > 0) {
        await Promise.all(productData.images.map(async (item) => {
          await deleteImage(item.url); // Assuming you have this function
        }));
      }
  
      // Delete the product document
      await deleteDoc(doc(firestore, COLLECTION_ID, productId));
  
      console.log(`Product with ID ${productId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting product: ", error);
      throw new Error("Failed to delete product");
    }
  };