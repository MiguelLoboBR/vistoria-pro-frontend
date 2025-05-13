
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Precarregar a logo para evitar atrasos na renderização
const preloadLogo = new Image();
preloadLogo.src = "/lovable-uploads/5f177951-9411-4feb-ab50-3e454df28a29.png";

createRoot(document.getElementById("root")!).render(<App />);
