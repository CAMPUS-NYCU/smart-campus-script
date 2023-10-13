import { Firestore } from "firebase-admin/firestore";

import { firestoreConfig } from "../../constants/firebase";
import mockClusters from "../../assets/data/cluster/mockClusters";

export const clearClusters = async (firestore: Firestore) => {
  const collection = firestore.collection(firestoreConfig.collection.cluster);

  const clusters = await collection
    .get()
    .then((clustersRef) => clustersRef.docs);
  const deleteDocPromises = clusters.map((cluster) => cluster.ref.delete());
  await Promise.all(deleteDocPromises);
};

const setMockClusters = async (firestore: Firestore) => {
  const collection = firestore.collection(firestoreConfig.collection.cluster);

  const setDocPromises = mockClusters.map(({ id, data }) =>
    collection.doc(id).set(data)
  );
  await Promise.all(setDocPromises);
};

export const setupMockClusters = async (firestore: Firestore) => {
  await clearClusters(firestore);
  await setMockClusters(firestore);
};
