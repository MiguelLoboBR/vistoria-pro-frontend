
import { useState, ReactNode, useEffect } from "react";
import Sidebar from "../admin/Sidebar";
import MobileSidebar from "../admin/MobileSidebar";
import Header from "../admin/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  SidebarProvider,
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarInset
} from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  
  // Auto collapse sidebar on mobile screens
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);
  
  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Desktop Sidebar */}
        <ShadcnSidebar className="hidden md:flex">
          <SidebarContent>
            <Sidebar 
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          </SidebarContent>
        </ShadcnSidebar>
        
        {/* Mobile Sidebar (Off-canvas) */}
        <MobileSidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onLogout={handleLogout}
        />
        
        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col w-full">
          {/* Top Header */}
          <Header onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          
          {/* Main Content */}
          <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 md:py-6 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
