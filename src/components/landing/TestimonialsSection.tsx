export const TestimonialsSection = () => {
  const testimonials = [
    {
      initials: "RL",
      color: "#0E3A78",
      name: "Renata Lima",
      role: "Gerente, ImobiExpress",
      quote:
        "O VistoriaPro reduziu em 70% o tempo que gastávamos com vistorias manuais. Nossa produtividade aumentou e os clientes elogiam a qualidade dos laudos.",
    },
    {
      initials: "MS",
      color: "#2E8B57",
      name: "Robson Santos",
      role: "Diretor, Imobiliária Premium",
      quote:
        "Com o VistoriaPro, diminuímos disputas relacionadas ao estado dos imóveis. A documentação fotográfica com data e localização é um diferencial incrível.",
    },
    {
      initials: "CA",
      color: "#0E3A78",
      name: "Cristina Almeida",
      role: "COO, Grupo Habitat",
      quote:
        "Após implementar o VistoriaPro, conseguimos escalar nossa operação sem precisar aumentar a equipe. Os vistoriadores fazem mais vistorias por dia.",
    },
  ];

  return (
    <section
      id="depoimentos"
      role="region"
      aria-label="Depoimentos de clientes"
      className="py-12 md:py-16 px-4 bg-white"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">
          Empresas que confiam no VistoriaPro
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-5 md:p-6 rounded-lg border border-gray-100 flex flex-col h-full"
            >
              <div className="flex-1">
                <blockquote className="italic text-gray-600 text-sm md:text-base mb-4">
                  “{t.quote}”
                </blockquote>
              </div>
              <div className="flex items-center mt-4">
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-sm md:text-base">{t.name}</p>
                  <p className="text-xs md:text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
