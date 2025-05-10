
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [authTimeout, setAuthTimeout] = useState(false);
  
  // Add a timeout to prevent infinite loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log("Auth loading timeout reached - showing fallback");
        setAuthTimeout(true);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // If still loading and haven't reached timeout, show loading indicator
  if (loading && !authTimeout) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mb-4"></div>
        <p className="text-muted-foreground">Loading your wellness data...</p>
      </div>
    );
  }
  
  // If loading timed out or no user, redirect to auth
  if (authTimeout || !user) {
    console.log("Redirecting to auth page", { authTimeout, hasUser: !!user });
    return <Navigate to="/auth" replace />;
  }
  
  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
