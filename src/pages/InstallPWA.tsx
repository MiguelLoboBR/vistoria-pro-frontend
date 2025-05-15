
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle2 } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if on iOS
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    setIsIos(iOS);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center text-gray-600">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Voltar</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Instale o VistoriaPro App</h1>
          
          {isInstalled ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-lg mb-4">O VistoriaPro já está instalado no seu dispositivo!</p>
              <Link to="/">
                <Button className="w-full bg-vistoria-blue">Ir para o App</Button>
              </Link>
            </div>
          ) : isIos ? (
            <div className="space-y-6">
              <p className="text-gray-700">Para instalar o VistoriaPro no seu iPhone ou iPad:</p>
              <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li>Toque no ícone de compartilhamento <span className="inline-block px-2 py-1 bg-gray-100 rounded">Compartilhar</span></li>
                <li>Role para baixo e toque em <span className="font-medium">Adicionar à Tela de Início</span></li>
                <li>Toque em <span className="font-medium">Adicionar</span> no canto superior direito</li>
              </ol>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-center text-gray-500 text-sm">
                  Após instalar, você poderá acessar o VistoriaPro diretamente da sua tela inicial.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-700">Instale o VistoriaPro para usar offline e receber notificações sobre suas vistorias.</p>
              <div className="flex justify-center">
                <Button 
                  onClick={handleInstallClick} 
                  disabled={!deferredPrompt}
                  className="bg-vistoria-blue hover:bg-vistoria-darkBlue px-8"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Instalar App
                </Button>
              </div>
              {!deferredPrompt && (
                <p className="text-sm text-center text-gray-500">
                  Se o botão estiver desabilitado, você pode estar usando um navegador incompatível ou o aplicativo já está instalado.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
