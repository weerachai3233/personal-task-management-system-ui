import { useRouter } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter()

  useEffect(() => {
    //check login
    let token = localStorage.getItem("token");
    console.log("token :", token);
    if (token) {
    } else {
      logout();
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
