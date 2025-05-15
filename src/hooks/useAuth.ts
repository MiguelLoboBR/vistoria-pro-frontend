
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// Export the useAuth hook for use in other components
export const useAuth = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};
