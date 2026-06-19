import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/config";

export async function createTrip(trip: any) {
  const docRef = await addDoc(collection(db, "trips"), {
    ...trip,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getUserTrips(uid: string) {
  const q = query(
    collection(db, "trips"),
    where("ownerId", "==", uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}