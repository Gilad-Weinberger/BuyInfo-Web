"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
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

  const getUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const createUser = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const newUserData = {
          id: user.uid,
          email: user.email,
          fullName: user.displayName || "",
          role: "client",
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, newUserData);
        setUserData(newUserData);
      } else {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error("Error creating/fetching user:", error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      const data = await getUserData(user.uid);
      setUserData(data);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        setUser(user);
        await createUser(user);
      } else {
        setUser(null);
        setUserData(null);
        const pathname = window.location.pathname;

        // Only redirect to signin if not already on an auth page or home
        if (!pathname.startsWith("/auth/") && pathname !== "/") {
          router.push("/auth/signin");
        }
      }

      setLoading(false);
      setInitialLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const value = {
    user,
    userData,
    loading,
    initialLoading,
    logout,
    getUserData,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
