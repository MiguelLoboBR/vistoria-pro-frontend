import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { useState, useEffect } from "react";

export const CTASection = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isInStandaloneMode);
  }, []);

  return (
    <section className="py-12 md:py-16 px-4 bg-[#0E3A78] text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
          Pronto para transformar suas vistorias?
        </h2>
        <p className="text-base md:text-lg mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
          Junte-se a centenas de empresas imobiliárias que já estão usando o VistoriaPro para melhorar seus processos.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto">
            <Button className="bg-white text-[#0E3A78] hover:bg-gray-100 font-semibold text-base md:text-lg px-6 py-5 md:px-8 md:py-6 w-full">
              Cadastre-se Grátis
            </Button>
          </Link>

          <a 
            href="https://wa.me/5524992289339" // Substitua com o número real
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 font-medium text-base md:text-lg px-6 py-5 md:px-8 md:py-6 w-full"
            >
              Fale com um Consultor
            </Button>
          </a>

          {!isStandalone && (
            <Link to="/install-pwa" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 font-medium text-base md:text-lg px-6 py-5 md:px-8 md:py-6 w-full"
              >
                <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Instalar App
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
