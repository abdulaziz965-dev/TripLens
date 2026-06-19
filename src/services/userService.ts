import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import { db } from "../firebase/config";

function logFirebaseError(context: string, error: unknown) {
  if (error && typeof error === "object") {
    const firebaseError = error as {
      code?: string;
      message?: string;
      name?: string;
      customData?: unknown;
    };
    const message = firebaseError.message ?? "";
    const isFirestoreUnavailable =
      firebaseError.code === "unavailable" ||
      message.toLowerCase().includes("cloud firestore api has not been used") ||
      (message.toLowerCase().includes("firestore") && message.toLowerCase().includes("disabled"));
    const isPermissionFailure = firebaseError.code === "permission-denied";

    console.error(`[TravelLens][Firestore] ${context}`, {
      code: firebaseError.code,
      message: firebaseError.message,
      name: firebaseError.name,
      customData: firebaseError.customData,
      FirestoreNotEnabledOrUnavailable: isFirestoreUnavailable,
      FirestorePermissionDenied: isPermissionFailure,
      raw: error,
    });

    if (isPermissionFailure) {
      console.error(
        "[TravelLens][Firestore] Firestore write failure reason: permissions rejected the users/{uid} write. Deploy firestore.rules so authenticated users can create/update only their own users/{uid} document."
      );
    }

    if (isFirestoreUnavailable) {
      console.error(
        "[TravelLens][Firestore] Firestore write failure reason: Firestore appears unavailable or not enabled for this Firebase project."
      );
    }

    return;
  }

  console.error(`[TravelLens][Firestore] ${context}`, { raw: error });
}

export async function createUserDocument(user: FirebaseUser) {
  const userRef = doc(db, "users", user.uid);

  console.log("[TravelLens][Firestore] Attempting Firestore write", {
    path: `users/${user.uid}`,
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  });

  try {
    await setDoc(
  userRef,
  {
    uid: user.uid,
    displayName:
    user.displayName ||
    user.email?.split("@")[0] ||
    "Traveler",
    email: user.email ?? "",
    photoURL: user.photoURL ?? null,

    notifications: true,
    currency: "INR",
    distanceUnit: "km",

    upiId: "",
    preferredPayment: "UPI",

    createdAt: serverTimestamp(),
  },
  { merge: true }
);

    console.log("[TravelLens][Firestore] Firestore write success", {
      path: `users/${user.uid}`,
      uid: user.uid,
    });
  } catch (error) {
    logFirebaseError("Firestore write failure", error);
    throw error;
  }
}
