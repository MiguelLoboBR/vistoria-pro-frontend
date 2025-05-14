
import { toast as sonnerToast, type ToastT } from "sonner";
import { 
  type ToastActionElement 
} from "@/components/ui/toast";
import * as React from "react";

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

// Define a proper type for Toast without extending ToastProps
export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  // Add other necessary properties that were from ToastProps
  className?: string;
  duration?: number;
}

// Define a proper useToast hook that doesn't cause circular dependencies
export const useToast = () => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    ({ title, description, variant, ...props }: Omit<Toast, "id">) => {
      setToasts((state) => {
        const id = Math.random().toString(36).substring(2, 9);
        return [...state, { id, title, description, variant, ...props }];
      });
    },
    []
  );

  const dismissToast = React.useCallback((id: string) => {
    setToasts((state) => state.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    dismissToast,
  };
};

// Export the type from sonner
export type { ToastT };
