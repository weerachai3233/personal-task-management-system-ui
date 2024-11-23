import { AuthContext } from "@/contexts/authContext";
import { useContext } from "react";

// Define the custom hook for accessing the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default useAuth;
