
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserProfile } from "@/contexts/types";

export interface ProfileUpdateData {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

export const profileService = {
  // Atualiza os dados do perfil do usuário
  updateProfile: async (userId: string, data: ProfileUpdateData): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", userId);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error.message);
      toast.error(`Falha ao atualizar perfil: ${error.message}`);
      return false;
    }
  },

  // Atualiza a senha do usuário
  updatePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error.message);
      toast.error(`Falha ao atualizar senha: ${error.message}`);
      return false;
    }
  },

  // Atualiza a foto de perfil do usuário
  updateProfilePhoto: async (userId: string, file: File): Promise<string | null> => {
    try {
      // Gera um nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      // Faz upload do arquivo para o Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtém a URL pública do arquivo
      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      
      if (!data.publicUrl) throw new Error("Não foi possível obter a URL da imagem");

      // Atualiza o perfil do usuário com a nova URL da foto
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      return data.publicUrl;
    } catch (error: any) {
      console.error("Erro ao atualizar foto de perfil:", error.message);
      toast.error(`Falha ao atualizar foto: ${error.message}`);
      return null;
    }
  }
};
