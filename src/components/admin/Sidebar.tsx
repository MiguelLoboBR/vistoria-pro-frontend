
import { ReactNode, useState } from "react";
import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  CreditCard, 
  ChevronDown 
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

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();
  
  const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", icon: <Home size={20} />, path: "/admin/dashboard" },
    { title: "Vistorias", icon: <Calendar size={20} />, path: "/admin/inspections" },
    { title: "Vistoriadores", icon: <Users size={20} />, path: "/admin/inspectors" },
    { title: "Financeiro", icon: <CreditCard size={20} />, path: "/admin/financeiro" },
    { title: "Relatórios", icon: <FileText size={20} />, path: "/admin/relatorios" },
    { title: "Configurações", icon: <Settings size={20} />, path: "/admin/profile" },
  ];

  return (
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
  );
};

export default Sidebar;
