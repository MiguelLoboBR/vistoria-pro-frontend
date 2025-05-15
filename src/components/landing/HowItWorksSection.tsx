
export const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Como funciona</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-[#0E3A78] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-semibold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Agende sua vistoria</h3>
            <p className="text-gray-600">Crie e organize vistorias diretamente do painel administrativo.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-[#0E3A78] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-semibold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Execute a inspeção</h3>
            <p className="text-gray-600">O vistoriador realiza a verificação com o aplicativo móvel, mesmo offline.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-[#0E3A78] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-semibold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Gere relatórios</h3>
            <p className="text-gray-600">Laudos profissionais são gerados automaticamente após a conclusão.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
