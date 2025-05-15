import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PWAInstallButtonProps {
  className?: string;
}

const PWAInstallButton = ({ className = '' }: PWAInstallButtonProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (PWA)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isInStandaloneMode);

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

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // If no installation prompt available, go to the install page
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the saved prompt since it can't be used again
    setDeferredPrompt(null);
  };

  // Don't show if already in standalone mode
  if (isStandalone) return null;

  // If we have a prompt, show direct install button
  if (deferredPrompt) {
    return (
      <Button 
        onClick={handleInstall}
        variant="outline"
        className={`fixed bottom-6 right-6 z-50 bg-vistoria-blue text-white border-vistoria-blue hover:bg-vistoria-darkBlue shadow-lg ${className}`}
      >
        <Download className="mr-2 h-5 w-5" /> Instalar App
      </Button>
    );
  }

  // Otherwise show link to install page
  return (
    <Link to="/install-pwa">
      <Button 
        variant="outline"
        className={`fixed bottom-6 right-6 z-50 bg-vistoria-blue text-white border-vistoria-blue hover:bg-vistoria-darkBlue shadow-lg ${className}`}
      >
        <Download className="mr-2 h-5 w-5" /> Instalar App
      </Button>
    </Link>
  );
};

export default PWAInstallButton;
