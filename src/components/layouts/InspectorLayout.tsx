
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSidebar from "@/components/inspector/layout/MobileSidebar";
import DesktopSidebar from "@/components/inspector/layout/DesktopSidebar";
import PageHeader from "@/components/inspector/layout/PageHeader";
import { useNavigationConfig } from "@/components/inspector/layout/NavigationConfig";

interface InspectorLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const InspectorLayout: React.FC<InspectorLayoutProps> = ({ 
  children,
  pageTitle,
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigation = useNavigationConfig();

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Determine page title based on current route or provided title
  const currentPage = () => {
    const current = navigation.find((item) => item.current);
    if (pageTitle) return pageTitle;
    if (current) return current.name;
    
    // Special cases for nested routes
    if (location.pathname.includes("/execute/")) return "Execução de Vistoria";
    if (location.pathname.includes("/inspection/")) return "Detalhes da Vistoria";
    
    return "Dashboard";
  };

  const showBackButton = location.pathname !== "/inspector/dashboard";

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-gray-50">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <DesktopSidebar navigation={navigation} />
        </Sidebar>

        {/* Mobile content area with sheet sidebar */}
        <SidebarInset className="flex-1 flex flex-col w-full">
          {/* Mobile header */}
          <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b md:hidden">
            <PageHeader title={currentPage()} showBackButton={showBackButton} />
            <MobileSidebar open={open} setOpen={setOpen} navigation={navigation} />
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
