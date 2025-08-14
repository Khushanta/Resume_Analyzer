// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  onAuthStateChanged,
  signInWithPopup,
  provider,
  signOut as firebaseSignOut
} from "../firebase";
import { getAuth } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser({
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        firebaseUser: result.user, // ⚠️ Store full Firebase user for token refresh
      });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logout = () => {
    firebaseSignOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
          firebaseUser: firebaseUser,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const unsubscribeToken = auth.onIdTokenChanged((firebaseUser) => {
      if (!firebaseUser) {
        console.warn("Token expired or user signed out.");
        setUser(null); // Auto-logout
      }
    });

    return () => {
      unsubscribe();
      unsubscribeToken();
    }
  }, []);

  // 🔁 Periodic token refresh every 45 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentUser = getAuth().currentUser;
      if (currentUser) {
        await currentUser.getIdToken(true); // Force refresh token
        console.log("Firebase token refreshed");
      }
    }, 45 * 60 * 1000); // 45 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
