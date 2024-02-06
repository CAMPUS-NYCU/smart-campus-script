import { setupEnv } from "./constants/env";
import * as scripts from "./scripts";
import initializeFirebase from "./utils/firebase/initialize";

const setup = () => {
  setupEnv();

  const firebase = initializeFirebase();

  return { firebase };
};

const setupData = async (firebase: ReturnType<typeof initializeFirebase>) => {
  await scripts.poi.setupMockPois(firebase.firestore, firebase.storage);
  await scripts.user.setupMockUser(firebase.auth, firebase.firestore);
}

const main = async () => {
  const { firebase } = setup();

  await setupData(firebase);
};

main();
