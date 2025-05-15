
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use optional chaining with the auth context in case it's not available
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user || null;
  
  // Cria uma função de navegação segura
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when viewport changes to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLoginUrl = () => {
    if (!isAuthenticated) return "/login";
    
    if (user?.role === "inspector") {
      return "/inspector/dashboard";
    } else {
      return "/admin/dashboard";
    }
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-vistoria-blue">
          VistoriaPro
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
          <a href="#features" className="text-gray-700 hover:text-vistoria-blue transition-colors">Recursos</a>
          <a href="#como-funciona" className="text-gray-700 hover:text-vistoria-blue transition-colors">Como Funciona</a>
          <a href="#depoimentos" className="text-gray-700 hover:text-vistoria-blue transition-colors">Clientes</a>
          <Link to={getLoginUrl()} className="text-vistoria-blue font-medium hover:underline">
            {isAuthenticated ? "Ir para Dashboard" : "Entrar"}
          </Link>
          {!isAuthenticated && (
            <Link to="/register">
              <Button className="bg-vistoria-blue hover:bg-vistoria-darkBlue">
                Cadastre-se
              </Button>
            </Link>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md pt-2 pb-4 absolute w-full animate-fade-in">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-gray-700 py-3 border-b border-gray-100" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Recursos
            </a>
            <a 
              href="#como-funciona" 
              className="text-gray-700 py-3 border-b border-gray-100" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Como Funciona
            </a>
            <a 
              href="#depoimentos" 
              className="text-gray-700 py-3 border-b border-gray-100" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Clientes
            </a>
            <Link 
              to={getLoginUrl()} 
              className="text-vistoria-blue font-medium py-3 border-b border-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isAuthenticated ? "Ir para Dashboard" : "Entrar"}
            </Link>
            {!isAuthenticated && (
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="py-3">
                <Button className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue">
                  Cadastre-se
                </Button>
              </Link>
            )}
            <Link to="/install-pwa" onClick={() => setMobileMenuOpen(false)} className="py-3">
              <Button variant="outline" className="w-full border-vistoria-blue text-vistoria-blue">
                Instalar App
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
