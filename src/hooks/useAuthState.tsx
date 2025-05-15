
import { useAuth } from "@/contexts/AuthContext";

export function useAuthState() {
  const auth = useAuth();
  
  return {
    user: auth.user,
    company: auth.company,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    session: auth.session,
  };
}
