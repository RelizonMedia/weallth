
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
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import AICompanionPage from "@/pages/AICompanionPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
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
              <Route path="/ai-companion" element={<ProtectedRoute><AICompanionPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
