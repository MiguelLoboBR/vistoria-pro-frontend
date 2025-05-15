
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-vistoria-blue">
          VistoriaPro
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-vistoria-blue transition-colors">Recursos</a>
          <a href="#how-it-works" className="text-gray-700 hover:text-vistoria-blue transition-colors">Como Funciona</a>
          <a href="#testimonials" className="text-gray-700 hover:text-vistoria-blue transition-colors">Clientes</a>
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
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md pt-2 pb-4 absolute w-full">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <a href="#features" className="text-gray-700 py-2" onClick={() => setMobileMenuOpen(false)}>Recursos</a>
            <a href="#how-it-works" className="text-gray-700 py-2" onClick={() => setMobileMenuOpen(false)}>Como Funciona</a>
            <a href="#testimonials" className="text-gray-700 py-2" onClick={() => setMobileMenuOpen(false)}>Clientes</a>
            <Link 
              to={getLoginUrl()} 
              className="text-vistoria-blue font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isAuthenticated ? "Ir para Dashboard" : "Entrar"}
            </Link>
            {!isAuthenticated && (
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue">
                  Cadastre-se
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
