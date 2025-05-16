
import { useLocation } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  User,
  History,
} from "lucide-react";

export const useNavigationConfig = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return [
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
      current: isActive("/inspections") || isActive("/execute") || isActive("/inspection/"),
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
      icon: History,
      current: isActive("/history"),
    },
    {
      name: "Perfil",
      href: "/inspector/profile",
      icon: User,
      current: isActive("/profile"),
    },
  ];
};
