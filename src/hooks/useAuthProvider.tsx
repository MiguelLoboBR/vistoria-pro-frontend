
import { useNavigate } from "react-router-dom";
import { useSessionManager } from "./useSessionManager";
import { useProfileFetcher } from "./useProfileFetcher";

export function useAuthProvider() {
  // The useNavigate hook is used safely inside the Router context provided in main.tsx
  const navigate = useNavigate();
  const { 
    user, 
    setUser, 
    company, 
    setCompany, 
    isAuthenticated, 
    isLoading, 
    setIsLoading, 
    session 
  } = useSessionManager();
  
  const { refreshUserProfile, fetchUserProfile } = useProfileFetcher();
  
  // Wrapper for refreshUserProfile that uses the current session
  const handleRefreshUserProfile = async () => {
    if (!session?.user?.id) return;
    
    const { profile, company: fetchedCompany } = await refreshUserProfile(session.user.id);
    
    if (profile) {
      setUser(profile);
    }
    
    if (fetchedCompany) {
      setCompany(fetchedCompany);
    }
  };

  // Wrapper for fetchUserProfile that updates state
  const handleFetchUserProfile = async (userId: string) => {
    const { profile, company: fetchedCompany } = await fetchUserProfile(userId);
    
    if (profile) {
      setUser(profile);
    }
    
    if (fetchedCompany) {
      setCompany(fetchedCompany);
    }
  };

  return {
    user,
    setUser,
    company,
    setCompany,
    isAuthenticated,
    isLoading,
    setIsLoading,
    session,
    refreshUserProfile: handleRefreshUserProfile,
    fetchUserProfile: handleFetchUserProfile
  };
}
