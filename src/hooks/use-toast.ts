
import { useState, useEffect } from "react";
// Import directly from the UI component to avoid circular dependencies
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const TOAST_LIMIT = 20;
const TOAST_REMOVE_DELAY = 1000;

type ToastState = {
  toasts: ToasterToast[];
};

// Create a singleton pattern implementation to avoid recursion
// This avoids the circular dependency problem
let count = 0;
let listeners: ((state: ToastState) => void)[] = [];
const toastState: ToastState = { toasts: [] };

// Internal functions for managing toast state
function update(state: ToastState) {
  toastState.toasts = state.toasts;
  listeners.forEach((listener) => {
    listener(toastState);
  });
}

function subscribe(listener: (state: ToastState) => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

// Create a standalone toast function that doesn't use the hook
function createToast(props: Omit<ToasterToast, "id">) {
  const id = String(count++);
  const newToast = { id, ...props };

  update({
    toasts: [newToast, ...toastState.toasts].slice(0, TOAST_LIMIT),
  });

  return {
    id,
    dismiss: () => dismissToast(id),
    update: (props: ToasterToast) => {
      update({
        toasts: toastState.toasts.map((t) =>
          t.id === id ? { ...t, ...props } : t
        ),
      });
    },
  };
}

function dismissToast(toastId: string) {
  update({
    toasts: toastState.toasts.filter((toast) => toast.id !== toastId),
  });
}

// The hook implementation that subscribes to state changes
export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  useEffect(() => {
    const unsubscribe = subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    toast: createToast,
    toasts: state.toasts,
    dismiss: dismissToast,
  };
}

// Standalone toast function (IMPORTANT: this doesn't use the hook to prevent recursion)
export const toast = createToast;

// Export types
export type { ToastState };
