
import { useAuth } from "@/contexts/AuthContext";
import { useAuthCheck } from "./company/useAuthCheck";
import { useLogoUpload } from "./company/useLogoUpload";
import { useRegistrationType } from "./company/useRegistrationType";
import { useCompanyCreation } from "./company/useCompanyCreation";

export const useCompanySetup = () => {
  const { user } = useAuth();
  const { userId, loading, authChecked } = useAuthCheck();
  const { logoFile, logoPreview, handleLogoChange } = useLogoUpload();
  const { registrationType, setRegistrationType } = useRegistrationType();
  const { isSubmitting, createCompany, createIndividualProfile } = useCompanyCreation(userId);

  return {
    user,
    isSubmitting,
    userId,
    loading,
    authChecked,
    registrationType,
    setRegistrationType,
    logoFile,
    logoPreview,
    handleLogoChange,
    createCompany,
    createIndividualProfile
  };
};
