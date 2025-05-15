
import { UserProfile } from "@/contexts/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, CreditCard } from "lucide-react";

interface ProfileFormProps {
  user: UserProfile | null;
  profileData: {
    full_name: string;
    phone: string;
  };
  setProfileData: React.Dispatch<React.SetStateAction<{
    full_name: string;
    phone: string;
  }>>;
}

export const ProfileForm = ({ user, profileData, setProfileData }: ProfileFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label className="flex items-center gap-2 text-gray-500 mb-1">
            <User className="h-4 w-4" />
            Nome Completo
          </Label>
          <Input 
            name="full_name"
            value={profileData.full_name} 
            onChange={handleChange} 
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
            name="phone"
            value={profileData.phone} 
            onChange={handleChange} 
            className="mt-1"
            placeholder="(00) 00000-0000"
          />
        </div>
        <div>
          <Label className="flex items-center gap-2 text-gray-500 mb-1">
            <CreditCard className="h-4 w-4" />
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
