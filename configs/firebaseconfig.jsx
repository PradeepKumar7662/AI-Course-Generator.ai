
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "coursses-543bd.firebaseapp.com",
  projectId: "coursses-543bd",
  storageBucket: "coursses-543bd.appspot.com",
  messagingSenderId: "342901597457",
  appId: "1:342901597457:web:22a9595a5c39d051ae58b0",
};

// Initialize Firebase only once
const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

export const storage = getStorage(app);

export default app;
