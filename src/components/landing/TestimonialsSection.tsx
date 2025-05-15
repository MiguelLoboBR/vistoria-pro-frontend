
export const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Empresas que confiam no VistoriaPro</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col">
            <div className="flex-1">
              <p className="italic text-gray-600 mb-4">
                "O VistoriaPro reduziu em 70% o tempo que gastávamos com vistorias manuais. Nossa produtividade aumentou e os clientes elogiam a qualidade dos laudos."
              </p>
            </div>
            <div className="flex items-center mt-4">
              <div className="w-12 h-12 rounded-full bg-[#0E3A78] flex items-center justify-center text-white font-bold">
                RL
              </div>
              <div className="ml-3">
                <p className="font-semibold">Renata Lima</p>
                <p className="text-sm text-gray-500">Gerente, ImobiExpress</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col">
            <div className="flex-1">
              <p className="italic text-gray-600 mb-4">
                "Com o VistoriaPro, diminuímos disputas relacionadas ao estado dos imóveis. A documentação fotográfica com data e localização é um diferencial incrível."
              </p>
            </div>
            <div className="flex items-center mt-4">
              <div className="w-12 h-12 rounded-full bg-[#2E8B57] flex items-center justify-center text-white font-bold">
                MS
              </div>
              <div className="ml-3">
                <p className="font-semibold">Marcelo Santos</p>
                <p className="text-sm text-gray-500">Diretor, Imobiliária Premium</p>
              </div>
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col">
            <div className="flex-1">
              <p className="italic text-gray-600 mb-4">
                "Após implementar o VistoriaPro, conseguimos escalar nossa operação sem precisar aumentar a equipe. Os vistoriadores fazem mais vistorias por dia."
              </p>
            </div>
            <div className="flex items-center mt-4">
              <div className="w-12 h-12 rounded-full bg-[#0E3A78] flex items-center justify-center text-white font-bold">
                CA
              </div>
              <div className="ml-3">
                <p className="font-semibold">Cristina Almeida</p>
                <p className="text-sm text-gray-500">COO, Grupo Habitat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
