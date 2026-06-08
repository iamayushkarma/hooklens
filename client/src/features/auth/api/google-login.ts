import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/shared/lib/firebase";

export const googleLoginApi = async () => {
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account", // forces account selection instead of silently reusing a Google account.
  });

  const result = await signInWithPopup(auth, provider);

  const idToken = await result.user.getIdToken();

  return { idToken, user: result.user };
};
