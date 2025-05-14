
import * as React from "react";
import { 
  ToastT as SonnerToastType, 
  toast as sonnerToast 
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

  const toast = (props: ToastProps) => {
    const { title, description, variant, action, duration } = props;
    
    // Map variant to Sonner's toast type
    let toastFn = sonnerToast;
    if (variant === "destructive" || variant === "warning") {
      toastFn = sonnerToast.error;
    } else if (variant === "success") {
      toastFn = sonnerToast.success;
    } else if (variant === "info") {
      toastFn = sonnerToast.info;
    }
    
    const id = toastFn(title || "", {
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

  const dismiss = React.useCallback((toastId?: string) => {
    if (toastId) {
      sonnerToast.dismiss(toastId);
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
    }
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
};

export { useToast, sonnerToast as toast };
