"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      // Only redirect to signin if not on the homepage
      const currentPath = window.location.pathname;
      if (currentPath !== "/") {
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  async function createUser(user) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        email: user.email,
        fullName: "",
        role: "client",
        createdAt: new Date().toISOString(),
      });
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await createUser(user);
      } else {
        setUser(null);
        const pathname = window.location.pathname;

        // Only redirect to signin if not already on an auth page or home
        if (!pathname.startsWith("/auth/") && pathname !== "/") {
          router.push("/auth/signin");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
