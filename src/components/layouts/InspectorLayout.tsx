
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
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";

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
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-gray-50">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="p-4 flex items-center justify-center border-b">
            <Logo />
          </SidebarHeader>
          
          <SidebarContent className="pt-2">
            <SidebarMenu className="px-2 space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.current}
                    tooltip={item.name}
                  >
                    <Link
                      to={item.href}
                      className={cn("flex items-center gap-2")}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="mt-auto border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile content area with sheet sidebar */}
        <SidebarInset className="flex-1 flex flex-col w-full">
          {/* Mobile header */}
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
                        "flex items-center py-3 px-3 text-sm font-medium rounded-md",
                        item.current
                          ? "bg-gray-100 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 flex-shrink-0 h-5 w-5",
                          item.current
                            ? "text-primary"
                            : "text-gray-400 group-hover:text-gray-500"
                        )}
                      />
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-3"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span>Sair</span>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default InspectorLayout;
