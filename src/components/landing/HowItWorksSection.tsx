
export const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">Como funciona</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center p-5">
            <div className="bg-[#0E3A78] text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-lg md:text-xl font-semibold">1</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Agende sua vistoria</h3>
            <p className="text-gray-600 text-sm md:text-base">Crie e organize vistorias diretamente do painel administrativo.</p>
          </div>
          
          <div className="text-center p-5">
            <div className="bg-[#0E3A78] text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-lg md:text-xl font-semibold">2</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Execute a inspeção</h3>
            <p className="text-gray-600 text-sm md:text-base">O vistoriador realiza a verificação com o aplicativo móvel, mesmo offline.</p>
          </div>
          
          <div className="text-center p-5">
            <div className="bg-[#0E3A78] text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-lg md:text-xl font-semibold">3</span>
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Gere relatórios</h3>
            <p className="text-gray-600 text-sm md:text-base">Laudos profissionais são gerados automaticamente após a conclusão.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
