
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const HeroSection = () => {
  return (
    <section className="pt-28 pb-16 md:py-24 px-4 bg-gradient-to-br from-[#0E3A78] to-[#061539] text-white">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2 md:pr-6 lg:pr-12 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            Revolucione suas vistorias imobiliárias
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90">
            O VistoriaPro transforma o processo de vistoria de imóveis, tornando-o mais eficiente, 
            preciso e profissional para empresas imobiliárias e seus vistoriadores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-white text-[#0E3A78] hover:bg-gray-100 font-medium text-base md:text-lg px-6 py-5 md:px-8 md:py-6">
              Teste Grátis por 05 Dias
            </Button>
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 font-medium text-base md:text-lg px-6 py-5 md:px-8 md:py-6 w-full sm:w-auto"
              >
                Agende Demonstração
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 font-medium text-base md:text-lg px-5 py-5 md:px-6 md:py-6 w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    <Play className="h-4 w-4 mr-2" /> Ver Vídeo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg md:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Conheça o VistoriaPro</DialogTitle>
                  </DialogHeader>
                  <div className="w-full mt-2">
                    <AspectRatio ratio={16 / 9}>
                      <iframe
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Demonstração do VistoriaPro"
                        allowFullScreen
                        className="rounded-md w-full h-full"
                      />
                    </AspectRatio>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="bg-white rounded-lg shadow-xl p-2 md:p-3 transform rotate-1 max-w-xs sm:max-w-md">
            <img 
              src="/lovable-uploads/e5709758-ff21-49ab-af3a-52d9a41e5479.png" 
              alt="Profissional realizando vistoria em imóvel usando o sistema VistoriaPro" 
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto text-center mt-10 md:mt-16">
        <a href="#recursos" className="inline-flex items-center text-white hover:text-gray-200">
          <span className="mr-2">Explore Nossos Recursos</span>
          <ArrowDown className="animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
