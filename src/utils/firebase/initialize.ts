import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const initializeFirebase = () => {
  const app = initializeApp({
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  return {
    app,
    auth,
    firestore,
    storage,
  };
};

export default initializeFirebase;
