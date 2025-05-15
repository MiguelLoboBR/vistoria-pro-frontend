
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ClipboardList,
  Clock,
  LayoutDashboard,
  Menu,
  User,
  LogOut,
  X,
  ChevronLeft,
} from "lucide-react";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface InspectorLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const InspectorLayout: React.FC<InspectorLayoutProps> = ({ 
  children,
  pageTitle,
}) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/inspector/dashboard",
      icon: LayoutDashboard,
      current: isActive("/dashboard"),
    },
    {
      name: "Vistorias",
      href: "/inspector/inspections",
      icon: ClipboardList,
      current: isActive("/inspections"),
    },
    {
      name: "Agenda",
      href: "/inspector/schedule",
      icon: CalendarDays,
      current: isActive("/schedule"),
    },
    {
      name: "Histórico",
      href: "/inspector/history",
      icon: Clock,
      current: isActive("/history"),
    },
    {
      name: "Perfil",
      href: "/inspector/profile",
      icon: User,
      current: isActive("/profile"),
    },
  ];

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleSignOut = () => {
    signOut();
  };

  const currentPage = navigation.find((item) => item.current)?.name || pageTitle;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r">
        <div className="flex-1 flex flex-col min-h-0 pt-5">
          <div className="flex items-center justify-center h-16">
            <Logo />
          </div>
          <nav className="flex-1 px-3 mt-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  item.current
                    ? "bg-gray-100 text-primary"
                    : "text-gray-600 hover:bg-gray-50",
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md"
                )}
              >
                <item.icon
                  className={cn(
                    item.current
                      ? "text-primary"
                      : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 flex-shrink-0 h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>

      {/* Mobile header and menu */}
      <div className="flex flex-col flex-1 w-full md:pl-64">
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b md:hidden">
          <div className="flex items-center space-x-4">
            {location.pathname !== "/inspector/dashboard" && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => window.history.back()} 
                className="md:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <span className="font-medium truncate max-w-[200px]">{currentPage}</span>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <Logo />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      item.current
                        ? "bg-gray-100 text-primary"
                        : "text-gray-600 hover:bg-gray-50",
                      "group flex items-center px-3 py-3 text-sm font-medium rounded-md"
                    )}
                  >
                    <item.icon
                      className={cn(
                        item.current
                          ? "text-primary"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 flex-shrink-0 h-5 w-5"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sair
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default InspectorLayout;
