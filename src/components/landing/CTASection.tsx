
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { useState, useEffect } from "react";

export const CTASection = () => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (PWA)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isInStandaloneMode);
  }, []);

  return (
    <section className="py-16 px-4 bg-[#0E3A78] text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para transformar suas vistorias?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Junte-se a centenas de empresas imobiliárias que já estão usando o VistoriaPro para melhorar seus processos.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <Button className="bg-white text-[#0E3A78] hover:bg-gray-100 font-medium text-lg px-8 py-6 w-full sm:w-auto">
              Cadastre-se Grátis
            </Button>
          </Link>
          <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-lg px-8 py-6 w-full sm:w-auto">
            Fale com um Consultor
          </Button>
          
          {/* PWA Install Button (only show if not already in standalone mode) */}
          {!isStandalone && (
            <Link to="/install-pwa" className="w-full sm:w-auto">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-lg px-8 py-6 w-full sm:w-auto">
                <Download className="mr-2 h-5 w-5" /> Instalar App
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
