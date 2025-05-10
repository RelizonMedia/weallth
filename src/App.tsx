
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import TrackPage from "./pages/TrackPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import WellnessBank from "./pages/WellnessBank";
import GoalTrackerPage from "./pages/GoalTrackerPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a new QueryClient with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      // Using meta.onError instead of onError directly as per latest Tanstack React Query
      meta: {
        onError: (error: any) => {
          console.error("Query error:", error);
        }
      }
    },
  },
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // Enhanced initialization with better error handling
  useEffect(() => {
    try {
      console.log("Weallth application initializing...");
      
      // Check if critical DOM elements are available
      if (!document.getElementById("root")) {
        throw new Error("Root element not found");
      }
      
      // Simulate initialization process
      const initApp = setTimeout(() => {
        console.log("Application initialized successfully");
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(initApp);
    } catch (error) {
      console.error("Initialization error:", error);
      setInitError(error instanceof Error ? error.message : "Unknown initialization error");
      setIsLoading(false);
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center text-white text-2xl font-bold animate-pulse-gentle mb-4">
          W
        </div>
        <div className="text-xl font-medium">Loading Weallth...</div>
      </div>
    );
  }

  // Show initialization error if any
  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg border-2 border-red-300">
          <h1 className="text-xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="mb-4">{initError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Refresh Application
          </button>
        </div>
      </div>
    );
  }

  // Render main application
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/track" element={<ProtectedRoute><TrackPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/wellness-bank" element={<ProtectedRoute><WellnessBank /></ProtectedRoute>} />
              <Route path="/goal-tracker" element={<ProtectedRoute><GoalTrackerPage /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
