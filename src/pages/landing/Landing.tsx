
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { CheckCircle, Calendar, Search, Shield, Users, Image } from "lucide-react";

export const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#recursos" className="text-gray-600 hover:text-vistoria-blue font-medium">Recursos</a>
            <a href="#como-funciona" className="text-gray-600 hover:text-vistoria-blue font-medium">Como Funciona</a>
            <a href="#contato" className="text-gray-600 hover:text-vistoria-blue font-medium">Contato</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-vistoria-blue text-vistoria-blue hover:bg-vistoria-blue hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/register" className="hidden md:block">
              <Button className="bg-vistoria-blue hover:bg-vistoria-darkBlue text-white">
                Registrar
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-vistoria-blue to-vistoria-darkBlue text-white">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Revolucione suas vistorias imobiliárias
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              O VistoriaPro transforma o processo de vistoria de imóveis, tornando-o mais eficiente, 
              preciso e profissional para empresas imobiliárias e seus vistoriadores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-vistoria-blue hover:bg-gray-100 font-medium text-lg px-8 py-6">
                Teste Grátis por 14 Dias
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-lg px-8 py-6">
                Agendar Demo
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white rounded-lg shadow-xl p-3 transform rotate-2 max-w-md">
              <div className="bg-gray-50 p-4 rounded border border-gray-100">
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">Vistoria #12345</h3>
                    <p className="text-sm text-gray-500">Apto 204, Bloco B, Residencial Vista Verde</p>
                  </div>
                  <span className="status-ok">Concluído</span>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="bg-gray-200 rounded h-24 w-24 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-gray-200 rounded h-24 w-24 flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="recursos" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Recursos que transformam seu trabalho</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="text-vistoria-blue mb-4">
                <Calendar className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Agendamento Integrado</h3>
              <p className="text-gray-600">Organize vistorias eficientemente com nosso sistema de agendamento inteligente.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="text-vistoria-blue mb-4">
                <Image className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Capturas com Geolocalização</h3>
              <p className="text-gray-600">Fotos e vídeos com marcação geográfica e timestamp para garantir autenticidade.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="text-vistoria-blue mb-4">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestão de Vistoriadores</h3>
              <p className="text-gray-600">Controle completo sobre sua equipe de vistoriadores e suas atividades.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="text-vistoria-blue mb-4">
                <Search className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Checklists Inteligentes</h3>
              <p className="text-gray-600">Modelos personalizáveis que garantem consistência e qualidade nas vistorias.</p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="text-vistoria-blue mb-4">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Segurança Avançada</h3>
              <p className="text-gray-600">Proteção de dados e documentos com criptografia e controle de acesso.</p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="text-vistoria-blue mb-4">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Laudos Profissionais</h3>
              <p className="text-gray-600">Relatórios personalizados com sua marca e formato profissional para seus clientes.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="como-funciona" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Como funciona</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-vistoria-blue text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-semibold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Agende sua vistoria</h3>
              <p className="text-gray-600">Crie e organize vistorias diretamente do painel administrativo.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-vistoria-blue text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-semibold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Execute a inspeção</h3>
              <p className="text-gray-600">O vistoriador realiza a verificação com o aplicativo móvel, mesmo offline.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-vistoria-blue text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-semibold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Gere relatórios</h3>
              <p className="text-gray-600">Laudos profissionais são gerados automaticamente após a conclusão.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-vistoria-blue text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para transformar suas vistorias?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a centenas de empresas imobiliárias que já estão usando o VistoriaPro para melhorar seus processos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-vistoria-blue hover:bg-gray-100 font-medium text-lg px-8 py-6">
              Teste Grátis por 14 Dias
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-lg px-8 py-6">
              Fale com um Consultor
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo className="mb-4" />
              <p className="text-sm">
                Transformando a maneira como empresas imobiliárias realizam vistorias desde 2023.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Início</a></li>
                <li><a href="#recursos" className="hover:text-white">Recursos</a></li>
                <li><a href="#como-funciona" className="hover:text-white">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white">Preços</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white">Documentação</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contato</h3>
              <p className="mb-2">contato@vistoriapro.app.br</p>
              <p>(11) 91234-5678</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© {new Date().getFullYear()} VistoriaPro. Todos os direitos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Termos de Uso</a>
              <a href="#" className="hover:text-white">Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
