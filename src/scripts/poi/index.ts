import { Firestore } from "firebase-admin/firestore";
import { Storage } from "firebase-admin/storage";
import fs from "fs";
import path from "path";

import { firebaseStorageUrl, firestoreConfig } from "../../constants/firebase";
import mockPois from "../../assets/data/poi/mockPois";

const clearPoisFirestore = async (firestore: Firestore) => {
  const collection = firestore.collection(firestoreConfig.collection.poi);

  const pois = await collection.get().then((poisRef) => poisRef.docs);
  const deleteDocPromises = pois.map((poi) => poi.ref.delete());
  await Promise.all(deleteDocPromises);
};

const clearPoisStorage = async (storage: Storage) => {
  await storage.bucket().deleteFiles({
    prefix: firebaseStorageUrl.images.poi,
  });
};

export const clearPois = async (firestore: Firestore, storage: Storage) => {
  await clearPoisFirestore(firestore);
  await clearPoisStorage(storage);
};

const setMockPoisFirestore = async (firestore: Firestore) => {
  const collection = firestore.collection(firestoreConfig.collection.poi);

  const setDocPromises = mockPois.map(({ id, data }) =>
    collection.doc(id).set(data)
  );
  await Promise.all(setDocPromises);
};

const setMockPoisStorage = async (storage: Storage) => {
  const bucket = storage.bucket();

  const setFilePromises = mockPois.map(({ id }) => {
    const srcDir = path
      .join("src/assets/", firebaseStorageUrl.images.poi, id)
      .replace(/\\/g, "/");
    const distDir = path
      .join(firebaseStorageUrl.images.poi, id)
      .replace(/\\/g, "/");

    return fs.readdirSync(srcDir).map((filename) => {
      const srcPath = path.join(srcDir, filename).replace(/\\/g, "/");
      const distPath = path.join(distDir, filename).replace(/\\/g, "/");

      return bucket.upload(srcPath, {
        destination: distPath,
        metadata: {
          contentType: "image/jpeg",
        },
      });
    });
  });
  await Promise.all(setFilePromises);
};

const setMockPois = async (firestore: Firestore, storage: Storage) => {
  await setMockPoisFirestore(firestore);
  await setMockPoisStorage(storage);
};

export const setupMockPois = async (firestore: Firestore, storage: Storage) => {
  await clearPois(firestore, storage);
  await setMockPois(firestore, storage);
};
