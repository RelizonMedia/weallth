
import { useState, useEffect } from "react";
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

// Export a proper hook implementation
export function useToast() {
  return useShadcnToast();
}

// Standalone toast function
export const toast = (options: ToastOptions) => {
  // Create an element to dispatch a custom event
  const toastEvent = new CustomEvent("toast", { 
    detail: options 
  });
  
  // Dispatch the event
  document.dispatchEvent(toastEvent);
};

// Add listener to handle toast events
if (typeof window !== 'undefined') {
  // Avoid adding multiple listeners
  const hasListener = (window as any).__hasToastListener;
  
  if (!hasListener) {
    document.addEventListener("toast", ((e: CustomEvent<ToastOptions>) => {
      const { toast } = useShadcnToast();
      if (toast) {
        toast(e.detail);
      }
    }) as EventListener);
    
    (window as any).__hasToastListener = true;
  }
}
