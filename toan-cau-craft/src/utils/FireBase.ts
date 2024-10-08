// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOjI1h9-xt5jNTHTie30hvFlcX64gv4m8",
  authDomain: "toan-cau-craft-dev.firebaseapp.com",
  projectId: "toan-cau-craft-dev",
  storageBucket: "toan-cau-craft-dev.appspot.com",
  messagingSenderId: "225801529412",
  appId: "1:225801529412:web:056cbcb6b54d48a03b3411",
  measurementId: "G-L9PWVW0HJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeFirestore(app, {
  localCache: persistentLocalCache()
})

const analytics = app.name && typeof window !== 'undefined' ? getAnalytics(app) : null;
const firestore = getFirestore(app);
const storage = getStorage(app);

export const auth = getAuth(app);

export { analytics, firestore, storage}