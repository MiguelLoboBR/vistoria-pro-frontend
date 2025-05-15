
import { useState } from "react";
import { toast } from "sonner";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { PasswordFormValues } from "@/components/inspector/profile/PasswordChangeDialog";
import UserInfoPanel from "@/components/inspector/profile/UserInfoPanel";
import CompanyInfoPanel from "@/components/inspector/profile/CompanyInfoPanel";
import PasswordChangeDialog from "@/components/inspector/profile/PasswordChangeDialog";

export const InspectorProfile = () => {
  const { user, company } = useAuth();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleUpdateProfile = () => {
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleChangePassword = (values: PasswordFormValues) => {
    // In a real implementation, we would verify the current password and update it
    toast.success("Senha alterada com sucesso!");
    setIsPasswordDialogOpen(false);
  };

  const handleUpdatePhoto = () => {
    toast.info("Recurso de atualização de foto em desenvolvimento");
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
            onUpdatePhoto={handleUpdatePhoto}
            onUpdateProfile={handleUpdateProfile}
          />
          <div className="md:col-span-8 flex justify-start">
            <Button 
              variant="outline" 
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              Alterar Senha
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
