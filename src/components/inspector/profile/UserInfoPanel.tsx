
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { UserProfile } from "@/contexts/types";
import ProfileForm from "./ProfileForm";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

interface UserInfoPanelProps {
  user: UserProfile | null;
  onUpdateProfile: () => void;
}

export const UserInfoPanel = ({ user, onUpdateProfile }: UserInfoPanelProps) => {
  const { updateProfilePhoto, isUploadingPhoto } = useProfile();
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || ""
  });
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validar se é uma imagem
    if (!file.type.match('image.*')) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }
    
    // Validar tamanho (máximo de 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }
    
    await updateProfilePhoto(file);
  };

  return (
    <Card className="md:col-span-8">
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
        <CardDescription>Atualize suas informações pessoais</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || "User"} />
              <AvatarFallback className="text-lg bg-vistoria-blue text-white">
                {user?.full_name ? getInitials(user.full_name) : "UN"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
              <input
                type="file"
                id="photo-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploadingPhoto}
              />
              <label htmlFor="photo-upload">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-8 w-8 bg-white cursor-pointer"
                  disabled={isUploadingPhoto}
                  asChild
                >
                  <div>
                    {isUploadingPhoto ? (
                      <div className="h-4 w-4 border-2 border-t-transparent border-vistoria-blue rounded-full animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </label>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">{user?.full_name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <Separator />

        <ProfileForm 
          user={user} 
          profileData={profileData} 
          setProfileData={setProfileData}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onUpdateProfile}>
          Salvar Alterações
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserInfoPanel;
