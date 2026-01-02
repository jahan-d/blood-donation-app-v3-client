// src/context/AuthContext.jsx
import { createContext, useEffect, useState, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import axios from "axios";
import { auth } from "../../firebase/firebase.init";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // backend user
  const [firebaseUser, setFirebaseUser] = useState(null); // firebase user
  const [loading, setLoading] = useState(true);

  // Axios instance with token
  const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  axiosSecure.interceptors.request.use((config) => {
    const token = localStorage.getItem("access-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Register
  const createUser = async (email, password, name, photoURL, extraData) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Default values to avoid invalid-credential
    await updateProfile(result.user, {
      displayName: name || "No Name",
      photoURL:
        photoURL ||
        "https://i.ibb.co/ZYW3VTp/brown-brim.png",
    });

    // Save user to backend
    await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
      email,
      name: name || "No Name",
      avatar:
        photoURL ||
        "https://i.ibb.co/ZYW3VTp/brown-brim.png",
      role: "donor",
      status: "active",
      ...extraData,
    });

    // Manual sync to handle race condition with onAuthStateChanged
    // Securely get ID token
    const idToken = await result.user.getIdToken();
    const tokenRes = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, {
      email,
      token: idToken,
    });
    localStorage.setItem("access-token", tokenRes.data.token);
    const profileRes = await axiosSecure.get("/users/profile");
    setUser(profileRes.data);

    return result;
  };

  // Login
  const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Logout
  const logoutUser = async () => {
    localStorage.removeItem("access-token");
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);

      if (currentUser?.email) {
        try {
          // Get JWT from backend
          // Get JWT from backend using ID Token
          const idToken = await currentUser.getIdToken();
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, {
            email: currentUser.email,
            token: idToken,
          });
          localStorage.setItem("access-token", res.data.token);

          // Get backend profile
          const profileRes = await axiosSecure.get("/users/profile");
          setUser(profileRes.data);
        } catch {
          localStorage.removeItem("access-token");
          setUser(null);
        }
      } else {
        localStorage.removeItem("access-token");
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        createUser,
        loginUser,
        logoutUser,
        axiosSecure,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
