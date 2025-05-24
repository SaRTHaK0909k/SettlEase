import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../firebase.config";
import User from "../models/UserModel";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await handleRedirectResult(); // safe to call every time
        setUser(mapFirebaseUserToCustomUser(firebaseUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      const credential = result && GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        localStorage.setItem("accessToken", token);
        console.log("Google access token stored.");
      }
    } catch (error) {
      console.error("Error getting redirect result:", error);
    }
  };

  const mapFirebaseUserToCustomUser = (firebaseUser: FirebaseUser): User => {
    const { uid, displayName, email, photoURL, metadata } = firebaseUser;
    return {
      id: uid,
      name: displayName || "",
      email: email || "",
      photoURL: photoURL || "",
      createdAt: new Date(metadata.creationTime || Date.now()),
      lastLogin: new Date(metadata.lastSignInTime || Date.now()),
      homeAddress: "",
      workAddress: "",
      birthday: null,
      gender: "",
    };
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/user.birthday.read");
    provider.addScope("https://www.googleapis.com/auth/user.gender.read");
    provider.addScope("https://www.googleapis.com/auth/drive");

    setLoading(true);
    try {
      await signInWithRedirect(auth, provider);
      // `getRedirectResult` will be handled in useEffect
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("accessToken");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within AuthContextProvider");
  }
  return context;
};
