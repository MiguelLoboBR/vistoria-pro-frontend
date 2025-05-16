
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";

interface DesktopSidebarProps {
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<any>;
    current: boolean;
  }>;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  navigation,
}) => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <SidebarHeader className="p-4 flex items-center justify-between border-b">
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
        <div className="mb-4 flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback className="bg-blue-500 text-white">
              {user?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "IN"}
            </AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-medium">{user?.full_name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </SidebarFooter>
    </>
  );
};

export default DesktopSidebar;
