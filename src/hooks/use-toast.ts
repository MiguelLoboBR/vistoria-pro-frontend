import { useReducer, useEffect, useRef } from "react"
import { toast as sonnerToast } from "sonner"

const TOAST_LIMIT = 20
const TOAST_REMOVE_DELAY = 1000000

type ToastActionType =
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "UPDATE_TOAST"; toast: Partial<Toast> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

interface State {
  toasts: Toast[]
}

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
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

export const reducer = (state: State, action: ToastActionType): State => {
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

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: ToastActionType) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Helper function to create a toast reducer
function toastReducer(state: State, action: ToastActionType): State {
  return reducer(state, action)
}

function useToaster(initialState: State = { toasts: [] }) {
  // Change from useState to useReducer for handling complex state updates
  const [state, dispatch] = useReducer(toastReducer, initialState)

  const dispatchRef = useRef(dispatch)
  useEffect(() => {
    dispatchRef.current = dispatch
  }, [dispatch])

  return {
    ...state,
    toast: (props: Omit<Toast, "id">) => {
      const id = genId()

      const update = (props: Partial<Toast>) =>
        dispatchRef.current({
          type: "UPDATE_TOAST",
          toast: { ...props, id },
        })
      const dismiss = () => dispatchRef.current({ type: "DISMISS_TOAST", toastId: id })

      dispatchRef.current({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: (open: boolean) => {
            if (!open) dismiss()
          },
        },
      })

      return {
        id: id,
        dismiss,
        update,
      }
    },
    dismiss: (toastId?: string) => dispatchRef.current({ type: "DISMISS_TOAST", toastId }),
  }
}

export function useToast() {
  const { toast, dismiss } = useToaster()
  return {
    toast,
    dismiss,
    success: (title: string, description?: string) => {
      toast({ title, description, variant: "default" })
      sonnerToast.success(title, {
        description,
      })
    },
    error: (title: string, description?: string) => {
      toast({ title, description, variant: "destructive" })
      sonnerToast.error(title, {
        description,
      })
    },
    warning: (title: string, description?: string) => {
      toast({ title, description })
      sonnerToast.warning(title, {
        description,
      })
    },
    info: (title: string, description?: string) => {
      toast({ title, description })
      sonnerToast.info(title, {
        description,
      })
    },
  }
}

// Re-export the Sonner toast for direct use
export const toast = sonnerToast
