
export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  backgroundColor: string;
  themeColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  scope: string;
  startUrl: string;
  icons: {
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }[];
}

export const pwaConfig: PWAConfig = {
  name: 'VistoriaPro',
  shortName: 'VistoriaPro',
  description: 'Sistema de gerenciamento de vistorias imobiliárias',
  backgroundColor: '#1A73E8',
  themeColor: '#1A73E8',
  display: 'standalone',
  scope: '/',
  startUrl: '/',
  icons: [
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable',
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
};

export default pwaConfig;
