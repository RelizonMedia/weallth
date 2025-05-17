
import { useState } from "react";
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

// Create a proper context-free implementation
let count = 0;
let listeners: Array<(state: ToastState) => void> = [];

const toastState: ToastState = {
  toasts: [],
};

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

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  useState(() => {
    const unsubscribe = subscribe(setState);
    return unsubscribe;
  });

  function dismissToast(toastId: string) {
    update({
      toasts: toastState.toasts.filter((toast) => {
        if (toast.id === toastId) {
          return false;
        }
        return true;
      }),
    });
  }

  function toast(props: Omit<ToasterToast, "id">) {
    const id = count++;
    const newToast = { id: String(id), ...props };

    update({
      toasts: [newToast, ...toastState.toasts].slice(0, TOAST_LIMIT),
    });

    return {
      id: String(id),
      dismiss: () => dismissToast(String(id)),
      update: (props: ToasterToast) => {
        update({
          toasts: toastState.toasts.map((t) =>
            t.id === String(id) ? { ...t, ...props } : t
          ),
        });
      },
    };
  }

  return {
    toast,
    toasts: state.toasts,
    dismiss: dismissToast,
  };
}

// Standalone toast function
export const toast = (props: Omit<ToasterToast, "id">) => {
  const { toast: toastFunc } = useToast();
  return toastFunc(props);
};

// Export types
export type { ToastState };
