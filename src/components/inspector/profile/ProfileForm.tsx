
import { UserProfile } from "@/contexts/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone } from "lucide-react";

interface ProfileFormProps {
  user: UserProfile | null;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  return (
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
  );
};

export default ProfileForm;
