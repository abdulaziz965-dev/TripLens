import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createUserDocument } from "./userService";
import { auth } from "../firebase/config";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

function logFirebaseError(context: string, error: unknown) {
  if (error && typeof error === "object") {
    const firebaseError = error as {
      code?: string;
      message?: string;
      name?: string;
      customData?: unknown;
    };

    console.error(`[TravelLens][Auth] ${context}`, {
      code: firebaseError.code,
      message: firebaseError.message,
      name: firebaseError.name,
      customData: firebaseError.customData,
      raw: error,
    });
    return;
  }

  console.error(`[TravelLens][Auth] ${context}`, { raw: error });
}

export async function loginWithGoogle() {
  console.log("[TravelLens][Auth] Google popup opened");

  try {
    const result = await signInWithPopup(auth, provider);

    console.log("[TravelLens][Auth] User object received", {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    });

    console.log("[TravelLens][Auth] Google login success", {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      providerData: result.user.providerData,
    });

    console.log("[TravelLens][Auth] createUserDocument() called", {
      uid: result.user.uid,
    });

    await createUserDocument(result.user);

    console.log("[TravelLens][Auth] User document creation completed", {
      uid: result.user.uid,
    });

    return result.user;
  } catch (error) {
    logFirebaseError("Google login or Firestore profile creation failed", error);

    try {
      if (auth.currentUser) {
        console.log("[TravelLens][Auth] Signing out after failed login flow", {
          uid: auth.currentUser.uid,
        });
        await signOut(auth);
      }
    } catch (signOutError) {
      logFirebaseError("Sign-out after login failure also failed", signOutError);
    }

    throw error;
  }
}
export async function registerWithEmail(
  email: string,
  password: string
) {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await createUserDocument(result.user);

  return result.user;
}

export async function loginWithEmail(
  email: string,
  password: string
) {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
}
