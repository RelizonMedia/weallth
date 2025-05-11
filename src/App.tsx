
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import TrackPage from "@/pages/TrackPage";
import GoalTrackerPage from "@/pages/GoalTrackerPage";
import WellnessBank from "@/pages/WellnessBank";
import Community from "@/pages/Community";
import Profile from "@/pages/Profile";
import UserProfile from "@/pages/UserProfile";
import Messages from "@/pages/Messages";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import AICompanionPage from "@/pages/AICompanionPage";
import MarketplacePage from "@/pages/MarketplacePage";
import MyWellnessSpaces from "@/pages/MyWellnessSpaces";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  // Add diagnostic logging for App component mount
  useEffect(() => {
    const hostname = window.location.hostname;
    console.log(`[App] App component mounted on ${hostname} at ${new Date().toISOString()}`);
    console.log(`[App] Window dimensions: ${window.innerWidth}x${window.innerHeight}`);
    
    // Log document ready state
    console.log(`[App] Document ready state: ${document.readyState}`);
    
    // Check for potential rendering issues
    if (hostname.includes('lovable.dev') || hostname.includes('lovable.app')) {
      console.log('[App] Running on Lovable domain - performing additional diagnostics');
      
      // Check if styles are loading correctly
      const styleSheets = document.styleSheets;
      console.log(`[App] Number of style sheets loaded: ${styleSheets.length}`);
      
      // Check for critical DOM elements
      const rootElement = document.getElementById('root');
      console.log(`[App] Root element exists: ${!!rootElement}`);
      console.log(`[App] Root element dimensions: ${rootElement?.clientWidth || 0}x${rootElement?.clientHeight || 0}`);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/track" element={<ProtectedRoute><TrackPage /></ProtectedRoute>} />
              <Route path="/goal-tracker" element={<ProtectedRoute><GoalTrackerPage /></ProtectedRoute>} />
              <Route path="/wellness-bank" element={<ProtectedRoute><WellnessBank /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/my-wellness-spaces" element={<ProtectedRoute><MyWellnessSpaces /></ProtectedRoute>} />
              <Route path="/ai-companion" element={<ProtectedRoute><AICompanionPage /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/user/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
