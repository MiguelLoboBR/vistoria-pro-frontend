
import { toast as sonnerToast, type Toast } from "sonner";
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

type ToastType = "default" | "success" | "error" | "warning" | "info";

interface ToastOptions {
  description?: string;
  type?: ToastType;
  duration?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
}

// We'll use sonner toast for consistency across the application
export function toast(title: string, options?: ToastOptions) {
  const { description, type = "default", duration = 5000 } = options || {};
  
  switch (type) {
    case "success":
      return sonnerToast.success(title, { description, duration });
    case "error":
      return sonnerToast.error(title, { description, duration });
    case "warning": 
      // Sonner doesn't have warning by default, use info with custom styling
      return sonnerToast(title, {
        description,
        duration,
        className: 'sonner-toast-warning'
      });
    case "info":
      return sonnerToast.info(title, { description, duration });
    default:
      return sonnerToast(title, { description, duration });
  }
}

// Re-export the useToast hook from shadcn/ui for components that rely on it
export const useToast = useShadcnToast;

export type { Toast };
