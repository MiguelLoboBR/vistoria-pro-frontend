import { useEffect, useState } from "react";
import { useSessionManager } from "./useSessionManager";
import { useProfileFetcher } from "./useProfileFetcher";
import { useNavigate } from "react-router-dom";

export function useAuthProvider() {
  const [navigate, setNavigate] = useState<(path: string) => void>(() => () => {});

  useEffect(() => {
    try {
      const nav = useNavigate();
      setNavigate(() => nav);
    } catch {
      console.warn("❗ useNavigate() falhou: usando fallback para window.location");
      setNavigate(() => (path: string) => {
        if (path) window.location.href = path;
      });
    }
  }, []);

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
