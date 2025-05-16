
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Users, DollarSign, BarChart2, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();
  const { user, company } = useAuth();
  
  // Update the navigation items to ensure they point to the correct routes
  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      title: "Vistorias",
      icon: FileText,
      href: "/admin/vistorias",
    },
    {
      title: "Inspetores",
      icon: Users,
      href: "/admin/inspectors",
    },
    {
      title: "Financeiro",
      icon: DollarSign,
      href: "/admin/financeiro",
    },
    {
      title: "Relatórios",
      icon: BarChart2,
      href: "/admin/relatorios",
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between py-4 px-4 border-b">
        {!isCollapsed ? (
          <div className="flex items-center">
            <Logo size="sm" />
            <span className="font-bold text-lg ml-2">
              {company?.name || "Vistoria Pro"}
            </span>
          </div>
        ) : (
          <Logo size="sm" />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", isCollapsed ? "rotate-180" : "")} />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="py-4 flex-grow flex flex-col justify-between overflow-y-auto">
        <nav className="px-2">
          {navigationItems.map((item) => (
            <Link
              to={item.href}
              key={item.title}
              className={cn(
                "flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 my-1",
                location.pathname === item.href
                  ? "bg-gray-100 font-medium"
                  : "text-gray-500"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.title}</span>}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-3 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || "Profile"} />
              <AvatarFallback className="bg-vistoria-blue text-white">
                {user?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "VA"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="truncate">
                <p className="text-sm font-medium truncate">{user?.full_name || "Visitante"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
