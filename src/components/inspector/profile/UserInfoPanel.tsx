
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Mail, Phone, User } from "lucide-react";
import { UserProfile } from "@/contexts/types";
import { toast } from "sonner";

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

        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center gap-2 text-gray-500 mb-1">
                <User className="h-4 w-4" />
                Nome Completo
              </Label>
              <Input 
                value={user?.full_name || ""} 
                onChange={(e) => {}} 
                className="mt-1"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2 text-gray-500 mb-1">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input 
                value={user?.email || ""} 
                disabled 
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="flex items-center gap-2 text-gray-500 mb-1">
                <Phone className="h-4 w-4" />
                Telefone
              </Label>
              <Input 
                value={user?.phone || ""} 
                onChange={(e) => {}} 
                className="mt-1"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2 text-gray-500 mb-1">
                <User className="h-4 w-4" />
                CPF
              </Label>
              <Input 
                value={user?.cpf || ""} 
                disabled 
                className="mt-1 bg-gray-50"
              />
            </div>
          </div>
        </div>
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
