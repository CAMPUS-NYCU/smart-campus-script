import { Firestore } from "firebase-admin/firestore";

import { firestoreConfig } from "../../constants/firebase";
import mockResourceGroups from "../../assets/data/resourceGroup/mockResourceGroups";

export const clearResourceGroups = async (firestore: Firestore) => {
  const collection = firestore.collection(
    firestoreConfig.collection.resourceGroup
  );

  const resourceGroups = await collection
    .get()
    .then((resourceGroupsRef) => resourceGroupsRef.docs);
  const deleteDocPromises = resourceGroups.map((resourceGroup) =>
    resourceGroup.ref.delete()
  );
  await Promise.all(deleteDocPromises);
};

const setMockResourceGroups = async (firestore: Firestore) => {
  const collection = firestore.collection(
    firestoreConfig.collection.resourceGroup
  );

  const setDocPromises = mockResourceGroups.map(({ id, data }) =>
    collection.doc(id).set(data)
  );
  await Promise.all(setDocPromises);
};

export const setupMockResourceGroups = async (firestore: Firestore) => {
  await clearResourceGroups(firestore);
  await setMockResourceGroups(firestore);
};
