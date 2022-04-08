import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";

export async function getDocData(path, key) {
  const filteredPath = path.replace("/undefined", "");
  const ref = doc(getFirestore(), filteredPath);

  const q = query(ref);

  const results = await getDoc(q);

  if (!results.data()) return;

  return key ? results.data()[key] : results.data();
}

export async function getCollectionData(path, key) {
  const ref = collection(getFirestore(), path);

  const q = query(ref);

  const results = await getDocs(q);

  const data = results?.docs.map((doc) => doc.data());

  return data;
}
