import { getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import clientConfig from "./clientConfig";

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}
const app = createFirebaseApp(clientConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
