// src/components/ui/sonner.tsx
import { Toaster as Sonner, toast } from "sonner";

const Toaster = () => {
  return (
    <Sonner
      position="top-right"
      richColors
      toastOptions={{
        className: "bg-white text-[#0E3A78] border border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700",
      }}
    />
  );
};

export { Toaster, toast };
