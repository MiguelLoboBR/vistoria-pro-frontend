
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarDays, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WelcomePanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="md:flex">
        <div className="p-6 flex-1">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-blue-100">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="bg-blue-500 text-white text-lg">
                {user?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "IN"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Olá, {user?.full_name?.split(" ")[0]}</h1>
              <p className="text-gray-500">Bem-vindo ao seu painel de inspetor</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-6 md:w-80 border-t md:border-t-0 md:border-l border-gray-100">
          <h3 className="font-medium mb-2">Acesso rápido</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => navigate("/inspector/schedule")}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Agenda
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => navigate("/inspector/inspections")}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Vistorias
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
