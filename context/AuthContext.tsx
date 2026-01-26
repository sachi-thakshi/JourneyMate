import { useLoader } from "@/hooks/useLoader";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { hideLoader, isLoading, showLoader } = useLoader();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    showLoader();
    const unscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      hideLoader();
    });

    return () => unscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth); 
      setUser(null);       
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading: isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
