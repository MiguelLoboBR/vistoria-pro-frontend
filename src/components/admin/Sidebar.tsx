import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LayoutDashboard, FileText, Users, DollarSign, BarChart2, ChevronLeft, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();
  const { user, company } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
      href: "/admin/inspectors", // Ensure this points to the correct route
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
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "bg-white border-r h-screen fixed top-0 left-0 z-20 flex flex-col transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-between py-3 px-4">
          {!isCollapsed && (
            <span className="font-bold text-xl">
              {company?.name || "Vistoria Pro"}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Collapse sidebar</span>
          </Button>
        </div>

        <div className="py-4 flex-grow flex flex-col justify-between">
          <nav className="px-2">
            {navigationItems.map((item) => (
              <Link
                to={item.href}
                key={item.title}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md hover:bg-gray-100",
                  location.pathname === item.href
                    ? "bg-gray-100 font-medium"
                    : "text-gray-500"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>

          <div className="px-4 py-3 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || "Profile"} />
                <AvatarFallback className="bg-vistoria-blue text-white">
                  {user?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "VA"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-medium">{user?.full_name || "Visitante"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
