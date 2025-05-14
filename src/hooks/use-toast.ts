import { useReducer, useEffect, useRef } from "react"
import { toast as sonnerToast } from "sonner"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

export type ToastActionElement = React.ReactElement<HTMLButtonElement>

export type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType =
  | { type: "ADD_TOAST"; toast: ToastProps }
  | { type: "UPDATE_TOAST"; toast: Partial<ToastProps> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

interface State {
  toasts: ToastProps[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const defaultState: State = {
  toasts: [],
}

const listeners: Array<(state: State) => void> = []

let state = defaultState

function dispatch(action: ActionType) {
  state = reducer(state, action)
  listeners.forEach((listener) => {
    listener(state)
  })
}

function useToaster() {
  const [state, setState] = useReducer(reducer, defaultState)
  const toastsRef = useRef<ToastProps[]>([])

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  toastsRef.current = state.toasts

  function toast(props: Omit<ToastProps, "id">) {
    const id = genId()
    
    const newToast = {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) {
          dismiss(id)
        }
      },
    }

    dispatch({
      type: "ADD_TOAST",
      toast: newToast,
    })

    return {
      id: id,
      dismiss: () => {
        dispatch({
          type: "DISMISS_TOAST",
          toastId: id,
        })
      },
      update: (newProps: Partial<ToastProps>) => {
        dispatch({
          type: "UPDATE_TOAST",
          toast: {
            ...newProps,
            id,
          },
        })
      },
    }
  }

  function dismiss(toastId?: string) {
    dispatch({
      type: "DISMISS_TOAST",
      toastId,
    })
  }

  // Also expose Sonner's toast API for convenience
  function success(title: string, description?: string) {
    sonnerToast.success(title, {
      description
    })
  }

  function error(title: string, description?: string) {
    sonnerToast.error(title, {
      description
    })
  }

  function warning(title: string, description?: string) {
    sonnerToast.warning(title, {
      description
    })
  }

  function info(title: string, description?: string) {
    sonnerToast.info(title, {
      description
    })
  }

  return {
    toasts: toastsRef.current,
    toast,
    dismiss,
    success,
    error, 
    warning,
    info,
  }
}

export function useToast() {
  const { toast, dismiss, toasts, success, error, warning, info } = useToaster()
  return {
    toasts,
    toast,
    dismiss,
    success,
    error, 
    warning,
    info
  }
}

// Re-export the Sonner toast for direct use
export const toast = sonnerToast
