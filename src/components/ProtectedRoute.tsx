
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [authTimeout, setAuthTimeout] = useState(false);
  const [showingError, setShowingError] = useState(false);
  
  // Debug - log hostname and pathname
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  useEffect(() => {
    console.log(`[ProtectedRoute] Rendering on ${hostname}, path: ${pathname}`);
    console.log(`[ProtectedRoute] Auth state: loading=${loading}, hasUser=${!!user}, authTimeout=${authTimeout}`);
  }, [loading, user, authTimeout, hostname, pathname]);
  
  // Add a timeout to prevent infinite loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log("[ProtectedRoute] Auth loading timeout reached - showing fallback");
        setAuthTimeout(true);
      }
    }, 3000); // 3 seconds for faster fallback
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Add a second timeout for error display if needed
  useEffect(() => {
    if (authTimeout && !user) {
      const errorTimer = setTimeout(() => {
        console.log("[ProtectedRoute] Auth error timeout reached - showing error");
        setShowingError(true);
      }, 2000);
      
      return () => clearTimeout(errorTimer);
    }
  }, [authTimeout, user]);
  
  // If still loading and haven't reached timeout, show loading indicator
  if (loading && !authTimeout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mb-4"></div>
        <p className="text-muted-foreground">Loading your wellness data...</p>
        <p className="text-xs text-muted-foreground mt-2">Domain: {hostname}</p>
      </div>
    );
  }
  
  // If loading timed out or no user, redirect to auth
  if (!user) {
    console.log(`[ProtectedRoute] Redirecting to auth page from ${pathname}`, { 
      authTimeout, 
      hasUser: !!user, 
      hostname 
    });
    return <Navigate to="/auth" replace />;
  }
  
  // User is authenticated, render children
  console.log(`[ProtectedRoute] User authenticated, rendering protected content on ${pathname}`);
  return <>{children}</>;
};

export default ProtectedRoute;
