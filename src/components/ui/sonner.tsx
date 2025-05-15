// src/components/ui/sonner.tsx
import { Toaster as Sonner, toast } from "sonner";

const Toaster = () => {
  return (
    <Sonner
      position="top-right"
      richColors
      toastOptions={{
        style: {
          borderRadius: '8px',
          background: 'white',
          color: '#0E3A78',
          border: '1px solid #D1D5DB',
          fontSize: '14px',
        },
      }}
    />
  );
};

export { Toaster, toast };
