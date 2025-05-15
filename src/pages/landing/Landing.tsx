
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { CheckCircle, Calendar, Search, Shield, Users, Image, Play, Youtube, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect } from "react";

export const Landing = () => {
  // Enable smooth scrolling for anchor links
  useEffect(() => {
    // Implementation of smooth scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchorElement = target.closest('a[href^="#"]');
      
      if (anchorElement) {
        e.preventDefault();
        const targetId = anchorElement.getAttribute('href');
        if (targetId) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 100,
              behavior: 'smooth',
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#recursos" className="text-gray-600 hover:text-[#0E3A78] font-medium">Recursos</a>
            <a href="#como-funciona" className="text-gray-600 hover:text-[#0E3A78] font-medium">Como Funciona</a>
            <a href="#depoimentos" className="text-gray-600 hover:text-[#0E3A78] font-medium">Depoimentos</a>
            <a href="#contato" className="text-gray-600 hover:text-[#0E3A78] font-medium">Contato</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="border-[#0E3A78] text-[#0E3A78] hover:bg-[#0E3A78] hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/register" className="hidden md:block">
              <Button className="bg-[#0E3A78] hover:bg-[#061539] text-white">
                Cadastre-se
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-[#0E3A78] to-[#061539] text-white">
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
              <Button className="bg-white text-[#0E3A78] hover:bg-gray-100 font-medium text-lg px-8 py-6">
                Teste Grátis por 05 Dias
              </Button>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-lg px-8 py-6">
                  Agende Demonstração Online
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-lg px-6 py-6">
                      <Play className="h-5 w-5 mr-2" /> Ver Vídeo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
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
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white rounded-lg shadow-xl p-3 transform rotate-2 max-w-md">
              <img 
                src="/lovable-uploads/e5709758-ff21-49ab-af3a-52d9a41e5479.png" 
                alt="Profissional realizando vistoria em imóvel usando o sistema VistoriaPro" 
                className="rounded-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
        <div className="container mx-auto text-center mt-16">
          <a href="#recursos" className="inline-flex items-center text-white hover:text-gray-200">
            <span className="mr-2">Explore Nossos Recursos</span>
            <ArrowDown className="animate-bounce" />
          </a>
        </div>
      </section>
      
      {/* Features Section */}
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
      
      {/* How It Works */}
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

      {/* Testimonials Section */}
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
      
      {/* CTA Section */}
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
      
      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Logo className="mb-4" />
              <p className="text-sm">
                Transformando a maneira como empresas imobiliárias realizam vistorias desde 2023.
              </p>
            </div>
            
            <div className="md:pl-4">
              <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Início</a></li>
                <li><a href="#recursos" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a></li>
              </ul>
            </div>
            
            <div className="md:pl-4">
              <h3 className="text-white font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div className="md:pl-4">
              <h3 className="text-white font-semibold mb-4">Contato</h3>
              <p className="mb-2">contato@vistoriapro.app.br</p>
              <p>(24) 99228-9339</p>
              <div className="flex mt-4 space-x-3">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">© {new Date().getFullYear()} VistoriaPro. Todos os direitos reservados.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Termos de Uso</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Política de Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
