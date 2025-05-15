
import { useSessionManager } from "./useSessionManager";
import { useProfileFetcher } from "./useProfileFetcher";
import { authService } from "@/services/authService";

export function useAuthProvider() {
  const {
    user,
    setUser,
    company,
    setCompany,
    isAuthenticated,
    isLoading,
    setIsLoading,
    session,
  } = useSessionManager();

  const { refreshUserProfile, fetchUserProfile } = useProfileFetcher();

  const handleRefreshUserProfile = async () => {
    if (!session?.user?.id) return;
    const { profile, company: fetchedCompany } = await refreshUserProfile(session.user.id);
    if (profile) setUser(profile);
    if (fetchedCompany) setCompany(fetchedCompany);
  };

  const handleFetchUserProfile = async (userId: string) => {
    const { profile, company: fetchedCompany } = await fetchUserProfile(userId);
    if (profile) setUser(profile);
    if (fetchedCompany) setCompany(fetchedCompany);
  };

  // Add registerInspector function
  const handleRegisterInspector = async (email: string, password: string, fullName: string, companyId: string) => {
    try {
      const inspector = await authService.registerInspector(email, password, fullName, companyId);
      return inspector;
    } catch (error: any) {
      console.error("Error registering inspector:", error.message);
      throw error;
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
    registerInspector: handleRegisterInspector, // Export the new function
  };
}
