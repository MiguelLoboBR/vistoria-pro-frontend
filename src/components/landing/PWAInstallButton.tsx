
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define o tipo BeforeInstallPromptEvent que está faltando
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallButtonProps {
  className?: string;
}

const PWAInstallButton = ({ className = "" }: PWAInstallButtonProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true; // iOS Safari support
      setIsStandalone(standalone);
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("resize", checkStandalone); // para capturar PWA iOS ao voltar

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("resize", checkStandalone);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ Usuário aceitou a instalação");
    } else {
      console.log("❌ Usuário recusou a instalação");
    }

    setDeferredPrompt(null);
  };

  // Já está instalado como PWA
  if (isStandalone) return null;

  // Botão para instalação direta se disponível
  const installButton = (
    <Button
      onClick={handleInstall}
      variant="outline"
      aria-label="Instalar Aplicativo"
      className={`fixed bottom-6 right-6 z-50 bg-vistoria-blue text-white border-vistoria-blue hover:bg-vistoria-darkBlue shadow-lg ${className}`}
    >
      <Download className="mr-2 h-5 w-5" /> Instalar App
    </Button>
  );

  return deferredPrompt ? (
    installButton
  ) : (
    <Link to="/install-pwa" aria-label="Ir para página de instalação do app">
      {installButton}
    </Link>
  );
};

export default PWAInstallButton;
