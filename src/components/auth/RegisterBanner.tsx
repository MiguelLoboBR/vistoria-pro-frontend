
export const RegisterBanner = () => {
  return (
    <div className="bg-vistoria-blue/10 relative h-full flex flex-col justify-center">
      <div className="absolute inset-0 flex flex-col justify-center p-16">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Gerencie suas vistorias com eficiência</h2>
          <p className="text-gray-600 mb-6">
            Com o VistoriaPro, você tem controle completo sobre vistorias, vistoriadores, relatórios e muito mais em uma interface simples e intuitiva.
          </p>
          <div className="space-y-4">
            <BenefitItem text="Checklist dinâmico por cômodo com edição em tempo real" />
            <BenefitItem text="Captura de imagens com edição e marcações diretamente no app" />
            <BenefitItem text="Geração automática de relatórios em PDF personalizados" />
            <BenefitItem text="Funcionamento offline com sincronização automática" />
          </div>
        </div>
      </div>
    </div>
  );
};

const BenefitItem = ({ text }: { text: string }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-5 w-5 text-vistoria-green">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <p className="ml-3 text-gray-600">{text}</p>
  </div>
);
