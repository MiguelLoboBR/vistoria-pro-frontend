
import { useState } from "react";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { PasswordFormValues } from "@/components/inspector/profile/PasswordChangeDialog";
import UserInfoPanel from "@/components/inspector/profile/UserInfoPanel";
import CompanyInfoPanel from "@/components/inspector/profile/CompanyInfoPanel";
import PasswordChangeDialog from "@/components/inspector/profile/PasswordChangeDialog";
import { useProfile } from "@/hooks/useProfile";

export const InspectorProfile = () => {
  const { user, company } = useAuth();
  const { updateProfile, changePassword, isUpdating, isChangingPassword } = useProfile();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleUpdateProfile = async () => {
    // Implementar com o hook de perfil
    await updateProfile({
      full_name: user?.full_name,
      phone: user?.phone
    });
  };

  const handleChangePassword = async (values: PasswordFormValues) => {
    const success = await changePassword(values.currentPassword, values.newPassword);
    if (success) {
      setIsPasswordDialogOpen(false);
    }
  };

  return (
    <InspectorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
          <p className="text-gray-500">Gerencie suas informações pessoais</p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Left Column - User Info */}
          <UserInfoPanel 
            user={user} 
            onUpdateProfile={handleUpdateProfile}
          />
          <div className="md:col-span-8 flex justify-start">
            <Button 
              variant="outline" 
              onClick={() => setIsPasswordDialogOpen(true)}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Alterando..." : "Alterar Senha"}
            </Button>
          </div>

          {/* Right Column - Company Info */}
          <CompanyInfoPanel company={company} />
        </div>

        <PasswordChangeDialog
          open={isPasswordDialogOpen}
          onOpenChange={setIsPasswordDialogOpen}
          onSubmit={handleChangePassword}
        />
      </div>
    </InspectorLayout>
  );
};

export default InspectorProfile;
