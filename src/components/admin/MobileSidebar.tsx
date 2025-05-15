
import { ReactNode } from "react";
import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  CreditCard,
  X,
  LogOut 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  icon: ReactNode;
  path: string;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const MobileSidebar = ({ isOpen, onClose, onLogout }: MobileSidebarProps) => {
  const location = useLocation();
  
  const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", icon: <Home size={20} />, path: "/admin/dashboard" },
    { title: "Vistorias", icon: <Calendar size={20} />, path: "/admin/inspections" },
    { title: "Vistoriadores", icon: <Users size={20} />, path: "/admin/inspectors" },
    { title: "Financeiro", icon: <CreditCard size={20} />, path: "/admin/financeiro" },
    { title: "Relatórios", icon: <FileText size={20} />, path: "/admin/relatorios" },
    { title: "Configurações", icon: <Settings size={20} />, path: "/admin/profile" },
  ];

  if (!isOpen) return null;
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>
      <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-lg animate-fade-in">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Logo />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
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
                onClick={onClose}
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
              onClick={onLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Sair</span>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;
