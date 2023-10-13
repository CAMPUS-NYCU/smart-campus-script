import { Firestore } from "firebase-admin/firestore";

import { firestoreConfig } from "../../constants/firebase";
import mockResources from "../../assets/data/resource/mockResources";

export const clearResources = async (firestore: Firestore) => {
  const collection = firestore.collection(firestoreConfig.collection.resource);

  const resources = await collection
    .get()
    .then((resourcesRef) => resourcesRef.docs);
  const deleteDocPromises = resources.map((resource) => resource.ref.delete());
  await Promise.all(deleteDocPromises);
};

const setMockResources = async (firestore: Firestore) => {
  const collection = firestore.collection(firestoreConfig.collection.resource);

  const setDocPromises = mockResources.map(({ id, data }) =>
    collection.doc(id).set(data)
  );
  await Promise.all(setDocPromises);
};

export const setupMockResources = async (firestore: Firestore) => {
  await clearResources(firestore);
  await setMockResources(firestore);
};
