
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionManager } from "./useSessionManager";
import { useProfileFetcher } from "./useProfileFetcher";

export function useAuthProvider() {
  const navigateFromRouter = useNavigate(); // ✅ chamada correta de hook no topo
  const [navigate, setNavigate] = useState<(path: string) => void>(() => () => {});

  useEffect(() => {
    // Agora já é seguro usar navigateFromRouter dentro do useEffect
    setNavigate(() => navigateFromRouter);
  }, [navigateFromRouter]);

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
    navigate,
  };
}
