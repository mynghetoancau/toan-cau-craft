import { auth, firestore } from "@/utils/FireBase";
import { addDoc, collection, doc, getDoc, getDocs, getDocsFromCache, updateDoc } from "firebase/firestore";

const COLLECTION_ID = "users"

export type User = {
    id: string;
    uid: string;
    email: string;
    role: string;
};

export const checkAdminRole = async (): Promise<boolean> => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
  
      // Truy vấn thông tin người dùng từ Firestore
      const userDoc = await getDoc(doc(firestore, COLLECTION_ID, uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Kiểm tra role
        if (userData.role === "admin") {
          console.log("Người dùng là admin");
          // Cho phép người dùng truy cập trang admin
          return true;
        } else {
          console.log("Người dùng không phải admin");
          // Chặn truy cập và chuyển hướng
          return false;
        }
      } else {
        console.log("Không tìm thấy thông tin người dùng");
        // Chuyển hướng đến trang đăng nhập
        return false;
      }
    } else {
      console.log("Người dùng chưa đăng nhập");
      // Chuyển hướng đến trang đăng nhập
      return false;
    }
  };