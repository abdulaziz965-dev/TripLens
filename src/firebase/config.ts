import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9Qs2oUZjv2Mu26-Q3GfUnpAimcH34pL0",
  authDomain: "appdonation-ad321.firebaseapp.com",
  projectId: "appdonation-ad321",
  storageBucket: "appdonation-ad321.firebasestorage.app",
  messagingSenderId: "697183438395",
  appId: "1:697183438395:web:5abb2bfa8d76da4fed7e1e",
  measurementId: "G-KV5CRL0PQM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const analytics =
  typeof window !== "undefined"
    ? getAnalytics(app)
    : null;

export default app;