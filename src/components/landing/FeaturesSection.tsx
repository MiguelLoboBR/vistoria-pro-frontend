import { Calendar, Search, Shield, Users, Image, CheckCircle } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section
      id="recursos"
      aria-labelledby="features-title"
      className="py-12 md:py-16 px-4 bg-white"
    >
      <div className="container mx-auto max-w-6xl">
        <h2
          id="features-title"
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12"
        >
          Recursos que transformam seu trabalho
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Feature 1 */}
          <div
            aria-label="Recurso: Agendamento Integrado"
            className="bg-gray-50 p-5 md:p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="text-[#0E3A78] mb-4">
              <Calendar className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              Agendamento Integrado
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Organize vistorias eficientemente com nosso sistema de agendamento inteligente.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            aria-label="Recurso: Capturas com Geolocalização"
            className="bg-gray-50 p-5 md:p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="text-[#0E3A78] mb-4">
              <Image className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              Capturas com Geolocalização
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Fotos e vídeos com marcação geográfica e timestamp para garantir autenticidade.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            aria-label="Recurso: Gestão de Vistoriadores"
            className="bg-gray-50 p-5 md:p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="text-[#0E3A78] mb-4">
              <Users className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              Gestão de Vistoriadores
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Controle completo sobre sua equipe de vistoriadores e suas atividades.
            </p>
          </div>

          {/* Feature 4 */}
          <div
            aria-label="Recurso: Checklists Inteligentes"
            className="bg-gray-50 p-5 md:p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="text-[#0E3A78] mb-4">
              <Search className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              Checklists Inteligentes
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Modelos personalizáveis que garantem consistência e qualidade nas vistorias.
            </p>
          </div>

          {/* Feature 5 */}
          <div
            aria-label="Recurso: Segurança Avançada"
            className="bg-gray-50 p-5 md:p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="text-[#0E3A78] mb-4">
              <Shield className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              Segurança Avançada
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Proteção de dados e documentos com criptografia e controle de acesso.
            </p>
          </div>

          {/* Feature 6 */}
          <div
            aria-label="Recurso: Laudos Profissionais"
            className="bg-gray-50 p-5 md:p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="text-[#0E3A78] mb-4">
              <CheckCircle className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              Laudos Profissionais
            </h3>
            <p className="text-gray-600 text-sm md:text-base">
              Relatórios personalizados com sua marca e formato profissional para seus clientes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
