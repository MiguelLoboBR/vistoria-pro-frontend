
import { useReducer, useEffect, useRef } from "react"
import { toast as sonnerToast } from "sonner"

const TOAST_LIMIT = 20
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

type ActionType = typeof actionTypes

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

function toastReducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId ? { ...t, open: false } : t
          ),
        }
      }
      return {
        ...state,
        toasts: state.toasts.map((t) => ({
          ...t,
          open: false,
        })),
      }
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== toastId),
        }
      }
      return {
        ...state,
        toasts: [],
      }
    }
  }
}

function useToaster(initialState: State = { toasts: [] }) {
  // Change from useState to useReducer for handling complex state updates
  const [state, dispatch] = useReducer(toastReducer, initialState)

  const dispatchRef = useRef(dispatch)
  useEffect(() => {
    dispatchRef.current = dispatch
  }, [dispatch])

  const toast = (props: Omit<ToasterToast, "id">) => {
    const id = genId()
    const newToast = { id, ...props }
    
    dispatchRef.current({
      type: actionTypes.ADD_TOAST,
      toast: newToast,
    })

    return id
  }

  const update = (id: string, props: Partial<ToasterToast>) => {
    dispatchRef.current({
      type: actionTypes.UPDATE_TOAST,
      toast: { id, ...props },
    })
  }

  const dismiss = (id?: string) => {
    dispatchRef.current({
      type: actionTypes.DISMISS_TOAST,
      toastId: id,
    })
  }

  const remove = (id?: string) => {
    dispatchRef.current({
      type: actionTypes.REMOVE_TOAST,
      toastId: id,
    })
  }

  return {
    toasts: state.toasts,
    toast,
    update,
    dismiss,
    remove,
  }
}

export const useToast = useToaster

// Re-export Sonner toast for direct usage
export { sonnerToast as toast }
