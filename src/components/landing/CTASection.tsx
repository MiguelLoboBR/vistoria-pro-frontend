
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-16 px-4 bg-[#0E3A78] text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para transformar suas vistorias?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Junte-se a centenas de empresas imobiliárias que já estão usando o VistoriaPro para melhorar seus processos.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <Button className="bg-white text-[#0E3A78] hover:bg-gray-100 font-medium text-lg px-8 py-6">
              Cadastre-se Grátis
            </Button>
          </Link>
          <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-lg px-8 py-6">
            Fale com um Consultor
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
