import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASAbe7QPsNHQwvPO4doQi_-C6opvNld2Y",
  authDomain: "monappfirebase-2512.firebaseapp.com",
  projectId: "monappfirebase-2512",
  storageBucket: "monappfirebase-2512.firebasestorage.app",
  messagingSenderId: "801511575198",
  appId: "1:801511575198:web:2d0001f8c9f6104a65f58f",
  measurementId: "G-BZ32775QC6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
