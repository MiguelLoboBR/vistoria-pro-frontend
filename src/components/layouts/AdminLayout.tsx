
import { useState, ReactNode } from "react";
import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  CreditCard, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  title: string;
  icon: ReactNode;
  path: string;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", icon: <Home size={20} />, path: "/admin/dashboard" },
    { title: "Vistorias", icon: <Calendar size={20} />, path: "/admin/inspections" },
    { title: "Vistoriadores", icon: <Users size={20} />, path: "/admin/inspectors" },
    { title: "Financeiro", icon: <CreditCard size={20} />, path: "/admin/financeiro" },
    { title: "Relatórios", icon: <FileText size={20} />, path: "/admin/relatorios" },
    { title: "Configurações", icon: <Settings size={20} />, path: "/admin/profile" },
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300", 
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          {isCollapsed ? (
            <div className="w-full flex justify-center">
              <Logo showText={false} />
            </div>
          ) : (
            <div className="flex justify-between items-center w-full">
              <Logo />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8"
              >
                <ChevronDown className={`h-5 w-5 transition-transform ${isCollapsed ? "-rotate-90" : "rotate-90"}`} />
              </Button>
            </div>
          )}
        </div>
        
        <nav className="flex-1 py-4">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                to={item.path}
                key={item.path}
                className={cn(
                  "flex items-center py-2 px-4 mb-1 text-gray-700 hover:bg-gray-100 hover:text-vistoria-blue rounded-md mx-2",
                  isActive ? "bg-gray-100 text-vistoria-blue font-medium" : ""
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
        
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>VistoriaPro © {new Date().getFullYear()}</p>
              <p>Versão 1.0</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
          {/* Mobile Menu Button */}
          <div className="block md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
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
                    to="/admin/tenant/perfil" 
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
        
        {/* Mobile Sidebar (Off-canvas) */}
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
              
              <nav className="py-4">
                {sidebarItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link 
                      to={item.path}
                      key={item.path}
                      className={cn(
                        "flex items-center py-3 px-4 text-gray-700 hover:bg-gray-100 hover:text-vistoria-blue",
                        isActive ? "bg-gray-100 text-vistoria-blue font-medium" : ""
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
                
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
        <main className="flex-1 px-4 py-6 md:px-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
