
import { useState } from "react";
import { Menu, ChevronDown, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Logo from "../Logo";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header = ({ onMobileMenuToggle }: HeaderProps) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const handleLogout = async () => {
    try {
      await signOut();
      // signOut will handle the navigation
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
      {/* Mobile Menu Button */}
      <div className="block md:hidden">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Page Title (for mobile) */}
      <div className="md:hidden">
        <Logo size="sm" />
      </div>
      
      {/* User Profile */}
      <div className="relative ml-auto">
        <div 
          className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-md"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar_url || ""} />
            <AvatarFallback className="bg-vistoria-blue text-white">
              {user?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium">
            {user?.full_name || "Usuário"}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
        
        {userMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-fade-in">
            <div className="p-3 border-b border-gray-200">
              <p className="text-sm font-medium">{user?.full_name || "Usuário"}</p>
              <p className="text-xs text-gray-500">{user?.email || ""}</p>
            </div>
            <div className="p-2">
              <Link 
                to="/admin/profile" 
                className="flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setUserMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                <span>Perfil da Empresa</span>
              </Link>
              <Separator className="my-1" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
