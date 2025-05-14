
import * as React from "react";
import { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

export type ToastType = "default" | "destructive" | "success" | "warning" | "info";

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
} & Pick<
  ToastProps,
  | "variant"
  | "className"
>;

type Action =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "UPDATE_TOAST"; toast: Partial<Toast>; id: string }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "REMOVE_TOAST"; id: string };

interface State {
  toasts: Toast[];
}

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      id: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { id } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action
      if (id) {
        addToRemoveQueue(id);
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === id || id === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }

    case "REMOVE_TOAST":
      if (action.id === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast_Props = Omit<Toast, "id">;

function toast({ ...props }: Toast_Props) {
  const id = genId();

  const update = (toast: Toast_Props) =>
    dispatch({
      type: "UPDATE_TOAST",
      id,
      toast,
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

// Utility toasts
toast.success = (title: string, description?: string) => {
  return toast({
    variant: "default",
    className: "bg-green-50 border-green-200 text-green-800",
    title,
    description,
  });
};

toast.error = (title: string, description?: string) => {
  return toast({
    variant: "destructive",
    title,
    description,
  });
};

toast.warning = (title: string, description?: string) => {
  return toast({
    variant: "default",
    className: "bg-yellow-50 border-yellow-200 text-yellow-800",
    title,
    description,
  });
};

toast.info = (title: string, description?: string) => {
  return toast({
    variant: "default",
    className: "bg-blue-50 border-blue-200 text-blue-800",
    title,
    description,
  });
};

toast.dismiss = (toastId?: string) => {
  dispatch({ type: "DISMISS_TOAST", id: toastId! });
};

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    const listener = (state: State) => {
      setState(state);
    };

    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", id: toastId! }),
  };
}

export { toast, useToast };
