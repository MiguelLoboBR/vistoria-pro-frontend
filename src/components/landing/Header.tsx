
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo size="md" />
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#recursos" className="text-gray-600 hover:text-[#0E3A78] font-medium">Recursos</a>
          <a href="#como-funciona" className="text-gray-600 hover:text-[#0E3A78] font-medium">Como Funciona</a>
          <a href="#depoimentos" className="text-gray-600 hover:text-[#0E3A78] font-medium">Depoimentos</a>
          <a href="#contato" className="text-gray-600 hover:text-[#0E3A78] font-medium">Contato</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline" className="border-[#0E3A78] text-[#0E3A78] hover:bg-[#0E3A78] hover:text-white">
              Login
            </Button>
          </Link>
          <Link to="/register" className="hidden md:block">
            <Button className="bg-[#0E3A78] hover:bg-[#061539] text-white">
              Cadastre-se
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
