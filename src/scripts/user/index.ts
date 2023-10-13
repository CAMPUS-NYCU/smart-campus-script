import { Auth } from "firebase-admin/auth";
import { Firestore } from "firebase-admin/firestore";

import { firestoreConfig } from "../../constants/firebase";
import mockUsers from "../../assets/data/user/mockUsers";

const clearUsersAuth = async (auth: Auth) => {
  await auth
    .listUsers()
    .then((usersRef) => usersRef.users)
    .then((users) => users.map((user) => user.uid))
    .then((uids) => auth.deleteUsers(uids));
};

const clearUsersFirestore = async (firestore: Firestore) => {
  const collection = firestore.collection(firestoreConfig.collection.user);

  const clusters = await collection
    .get()
    .then((clustersRef) => clustersRef.docs);
  const deleteDocPromises = clusters.map((cluster) => cluster.ref.delete());
  await Promise.all(deleteDocPromises);
};

export const clearUsers = async (auth: Auth, firestore: Firestore) => {
  await clearUsersAuth(auth);
  await clearUsersFirestore(firestore);
};

const setMockUserAuth = async (auth: Auth) => {
  const createPromises = mockUsers.map(({ id, auth: userAuth }) =>
    auth.createUser({
      uid: id,
      ...userAuth,
    })
  );
  await Promise.all(createPromises);
};

const setMockUserFirestore = async (firestore: Firestore) => {
  const collection = firestore.collection(firestoreConfig.collection.user);

  const createPromises = mockUsers.map(({ id, data }) =>
    collection.doc(id).set(data)
  );
  await Promise.all(createPromises);
};

const setMockUser = async (auth: Auth, firestore: Firestore) => {
  await setMockUserAuth(auth);
  await setMockUserFirestore(firestore);
};

export const setupMockUser = async (auth: Auth, firestore: Firestore) => {
  await clearUsers(auth, firestore);
  await setMockUser(auth, firestore);
};
