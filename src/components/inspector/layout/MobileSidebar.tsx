
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ClipboardList,
  History,
  LayoutDashboard,
  User,
  LogOut,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  navigation: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<any>;
    current: boolean;
  }>;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  open,
  setOpen,
  navigation,
}) => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = () => {
    signOut();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
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
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  item.current
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {item.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="mb-4 flex items-center gap-3 px-3 py-2">
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
              className="w-full justify-start px-3"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Sair</span>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
