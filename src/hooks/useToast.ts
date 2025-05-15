
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

  const toast = (props: ToastProps) => {
    const { title, description, variant, action, duration } = props;
    
    // Map variant to Sonner's toast type and call the appropriate function
    let id: string;
    const data: ExternalToast = {
      description,
      action,
      duration,
    };

    if (variant === "destructive") {
      id = sonnerToast.error(title || "", data).toString();
    } else if (variant === "success") {
      id = sonnerToast.success(title || "", data).toString();
    } else if (variant === "info") {
      id = sonnerToast.info(title || "", data).toString();
    } else if (variant === "warning") {
      id = sonnerToast.warning(title || "", data).toString();
    } else {
      id = sonnerToast(title || "", data).toString();
    }

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
