import { ApiResponse, profile } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { createContext, useState, ReactNode, useEffect } from "react";

export interface User {
  avatar_url: string;
  bio: string;
  email: string;
  full_name: string;
  user_id: string;
  user_name: string;
}
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      const result: ApiResponse = await profile();
      if (!result.status) {
        logout();
      } else {
        setUser(result?.data?.user ?? null);
      }
    };
    getProfile();
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
