
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { UserProfile } from "@/contexts/types";
import ProfileForm from "./ProfileForm";

interface UserInfoPanelProps {
  user: UserProfile | null;
  onUpdatePhoto: () => void;
  onUpdateProfile: () => void;
}

export const UserInfoPanel = ({ user, onUpdatePhoto, onUpdateProfile }: UserInfoPanelProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleUpdateProfile = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      setIsUpdating(false);
      onUpdateProfile();
    }, 1500);
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
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 bg-white"
              onClick={onUpdatePhoto}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-medium">{user?.full_name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <Separator />

        <ProfileForm user={user} />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpdateProfile}
          disabled={isUpdating}
        >
          {isUpdating ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserInfoPanel;
