
import * as React from "react";
import { 
  toast as sonnerToast,
  type ToastT as SonnerToastType,
  type ExternalToast
} from "sonner";

export type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  action?: React.ReactNode;
  duration?: number;
};

export type ToastT = SonnerToastType;

export type Toast = {
  id: string;
} & ToastProps;

const useToast = () => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = (props: ToastProps) => {
    const { title, description, variant, action, duration } = props;
    
    // Map variant to Sonner's toast type
    const id = sonnerToast(title || "", {
      description,
      action,
      duration,
    }).toString();

    setToasts((prevToasts) => [
      ...prevToasts,
      { id, title, description, variant, action, duration },
    ]);

    return id;
  };

  const dismissToast = React.useCallback((toastId?: string) => {
    if (toastId) {
      sonnerToast.dismiss(toastId);
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
    }
  }, []);

  return {
    toast: addToast,
    dismiss: dismissToast,
    toasts,
  };
};

// Re-export sonner toast for direct access
const toast = sonnerToast;

export { useToast, toast };
