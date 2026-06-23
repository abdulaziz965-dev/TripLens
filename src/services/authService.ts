import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createUserDocument } from "./userService";
import { auth } from "../firebase/config";
import { sendEmailVerification } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 2;

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
  name: string,
  email: string,
  password: string
) {
  if (password.length < 8) {
  throw new Error(
    "Password must be at least 8 characters long."
  );
}

const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

if (!strongPassword.test(password)) {
  throw new Error(
    "Password must contain uppercase, lowercase, and a number."
  );
}
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(result.user, {
  displayName: name,
});

  await createUserDocument(result.user);
  await sendEmailVerification(result.user);
  await signOut(auth);
  return result.user;
}
export async function resetPassword(
  email: string
) {
  await sendPasswordResetEmail(
    auth,
    email
  );
}
export async function loginWithEmail(
  email: string,
  password: string
) {
  const attempts =
  Number(localStorage.getItem("loginAttempts")) || 0;

if (attempts >= MAX_LOGIN_ATTEMPTS) {
  throw new Error(
    `Too many login attempts. Try again in ${LOCKOUT_MINUTES} minutes.`
  );
}
  try {
    const result =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    await result.user.reload();

    if (!result.user.emailVerified) {
      await signOut(auth);

      throw new Error(
        "Please verify your email before logging in."
      );
    }

    localStorage.removeItem("loginAttempts");

    return result.user;
  } catch (error) {
    const attempts =
      Number(
        localStorage.getItem("loginAttempts")
      ) || 0;

    localStorage.setItem(
      "loginAttempts",
      String(attempts + 1)
    );

    throw error;
  }
}