
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine the home route based on user role
  const getHomeRoute = () => {
    if (!user) return "/";
    
    if (user.role === "admin") {
      return "/admin/tenant/dashboard";
    } else if (user.role === "inspector") {
      return "/app/inspector/dashboard";
    }
    
    return "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-6xl font-bold text-vistoria-blue mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-2">Página não encontrada</p>
        <p className="text-gray-500 mb-6">
          A página que você está procurando não existe ou foi removida.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            Voltar
          </Button>
          
          <Link to={getHomeRoute()}>
            <Button className="bg-vistoria-blue hover:bg-vistoria-darkBlue flex items-center gap-2 w-full">
              <Home size={18} />
              Ir para o início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
