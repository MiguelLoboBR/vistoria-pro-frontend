
import { useState, ReactNode } from "react";
import { Home, Calendar, FileText, Settings, LogOut, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface InspectorLayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  icon: ReactNode;
  path: string;
  active?: boolean;
}

export const InspectorLayout = ({ children }: InspectorLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const navItems: NavItem[] = [
    { title: "Início", icon: <Home size={20} />, path: "/inspector/dashboard", active: true },
    { title: "Agenda", icon: <Calendar size={20} />, path: "/inspector/schedule" },
    { title: "Histórico", icon: <FileText size={20} />, path: "/inspector/history" },
    { title: "Perfil", icon: <Settings size={20} />, path: "/inspector/profile" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      // signOut will handle the navigation
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between sticky top-0 z-10">
        {/* Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Logo */}
        <Logo size="sm" />
        
        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar_url || ""} />
          <AvatarFallback className="bg-vistoria-blue text-white">
            {user?.full_name?.charAt(0) || "V"}
          </AvatarFallback>
        </Avatar>
      </header>
      
      {/* Mobile Menu (Off-canvas) */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-lg animate-fade-in">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <Logo />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar_url || ""} />
                  <AvatarFallback className="bg-vistoria-blue text-white">
                    {user?.full_name?.charAt(0) || "V"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.full_name || "Vistoriador"}</p>
                  <p className="text-sm text-gray-500">{user?.role || "Vistoriador"}</p>
                </div>
              </div>
            </div>
            
            <nav className="py-4">
              {navItems.map((item, index) => (
                <Link 
                  to={item.path}
                  key={index}
                  className={cn(
                    "flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-vistoria-blue",
                    item.active ? "bg-gray-100 text-vistoria-blue font-medium" : ""
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              ))}
              
              <div className="px-4 pt-4 mt-4 border-t border-gray-200">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-3"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Sair</span>
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
      
      {/* Main Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        {children}
      </main>
      
      {/* Bottom Navigation (Mobile) */}
      <div className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
        <nav className="flex justify-around py-2">
          {navItems.map((item, index) => (
            <Link 
              to={item.path}
              key={index}
              className={cn(
                "flex flex-col items-center py-1 px-2 text-xs",
                item.active ? "text-vistoria-blue" : "text-gray-500"
              )}
            >
              {item.icon}
              <span className="mt-1">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default InspectorLayout;
