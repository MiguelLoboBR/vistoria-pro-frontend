
import { useNavigate } from "react-router-dom";
import { useSessionManager } from "./useSessionManager";
import { useProfileFetcher } from "./useProfileFetcher";

export function useAuthProvider() {
  // Creating a safe navigation function that checks if we're in a Router context
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.warn("useAuthProvider: Router context not found, navigation will be handled via window.location");
    navigate = (path: string) => {
      console.warn(`Navigation to ${path} attempted without Router context`);
      // Use window.location as a fallback if absolutely necessary
      if (path) {
        window.location.href = path;
      }
    };
  }
  
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
    fetchUserProfile: handleFetchUserProfile,
    navigate
  };
}
