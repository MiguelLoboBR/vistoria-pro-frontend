
import { useState } from "react";
import { toast } from "sonner";
import { profileService, ProfileUpdateData } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";

export const useProfile = () => {
  const { user, refreshUserProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Atualizar dados do perfil
  const updateProfile = async (data: ProfileUpdateData) => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return false;
    }

    setIsUpdating(true);
    try {
      const success = await profileService.updateProfile(user.id, data);
      if (success) {
        toast.success("Perfil atualizado com sucesso!");
        await refreshUserProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Atualizar senha
  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsChangingPassword(true);
    try {
      const success = await profileService.updatePassword(currentPassword, newPassword);
      if (success) {
        toast.success("Senha alterada com sucesso!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Atualizar foto de perfil
  const updateProfilePhoto = async (file: File) => {
    if (!user) {
      toast.error("Usuário não autenticado");
      return null;
    }

    setIsUploadingPhoto(true);
    try {
      const newPhotoUrl = await profileService.updateProfilePhoto(user.id, file);
      if (newPhotoUrl) {
        toast.success("Foto de perfil atualizada com sucesso!");
        await refreshUserProfile();
        return newPhotoUrl;
      }
      return null;
    } catch (error) {
      console.error("Erro ao atualizar foto:", error);
      return null;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return {
    updateProfile,
    changePassword,
    updateProfilePhoto,
    isUpdating,
    isChangingPassword,
    isUploadingPhoto
  };
};
