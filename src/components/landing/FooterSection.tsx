
import Logo from "@/components/Logo";

export const FooterSection = () => {
  return (
    <footer
      id="contato"
      className="bg-gray-900 text-gray-300 py-10 md:py-12 px-4"
      aria-labelledby="footer-heading"
    >
      <div className="container mx-auto max-w-6xl">
        <h2 id="footer-heading" className="sr-only">Rodapé</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo e missão */}
          <div>
            <Logo className="mb-4" />
            <p className="text-sm">
              Transformando a maneira como empresas imobiliárias realizam vistorias desde 2023.
            </p>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#topo" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="#recursos" className="hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
              <li><a href="#contato" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <p className="text-sm mb-2">contato@vistoriapro.app.br</p>
            <p className="text-sm">(24) 99228-9339</p>
            <div className="flex mt-4 space-x-3" aria-label="Redes Sociais">
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523..."></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c..."></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.315 2c..."></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-gray-800 mt-8 md:mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs md:text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} VistoriaPro. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">
              Termos de Uso
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">
              Política de Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
