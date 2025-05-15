
import { Calendar, Search, Shield, Users, Image, CheckCircle } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section id="recursos" className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Recursos que transformam seu trabalho</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="text-[#0E3A78] mb-4">
              <Calendar className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Agendamento Integrado</h3>
            <p className="text-gray-600">Organize vistorias eficientemente com nosso sistema de agendamento inteligente.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="text-[#0E3A78] mb-4">
              <Image className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Capturas com Geolocalização</h3>
            <p className="text-gray-600">Fotos e vídeos com marcação geográfica e timestamp para garantir autenticidade.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="text-[#0E3A78] mb-4">
              <Users className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestão de Vistoriadores</h3>
            <p className="text-gray-600">Controle completo sobre sua equipe de vistoriadores e suas atividades.</p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="text-[#0E3A78] mb-4">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Checklists Inteligentes</h3>
            <p className="text-gray-600">Modelos personalizáveis que garantem consistência e qualidade nas vistorias.</p>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="text-[#0E3A78] mb-4">
              <Shield className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Segurança Avançada</h3>
            <p className="text-gray-600">Proteção de dados e documentos com criptografia e controle de acesso.</p>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="text-[#0E3A78] mb-4">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Laudos Profissionais</h3>
            <p className="text-gray-600">Relatórios personalizados com sua marca e formato profissional para seus clientes.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
