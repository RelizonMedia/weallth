
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
  const mountTimestamp = new Date().toISOString(); // Capture mount time
  
  useEffect(() => {
    console.log(`[ProtectedRoute] Rendering on ${hostname}, path: ${pathname}, time: ${mountTimestamp}`);
    console.log(`[ProtectedRoute] Auth state: loading=${loading}, hasUser=${!!user}, userId=${user?.id || 'none'}, authTimeout=${authTimeout}`);
    
    // Extra debug for user object
    if (user) {
      console.log(`[ProtectedRoute] User authenticated:`, {
        id: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at ? true : false,
        lastSignIn: user.last_sign_in_at,
        userMetadata: user.user_metadata
      });
    }
    
    // For Lovable.dev domain, log additional diagnostic information
    if (hostname.includes('lovable.dev') || hostname.includes('lovable.app')) {
      console.log('[ProtectedRoute] Running on Lovable domain - additional diagnostics:');
      console.log('[ProtectedRoute] Document readyState:', document.readyState);
      console.log('[ProtectedRoute] Window dimensions:', window.innerWidth, 'x', window.innerHeight);
      console.log('[ProtectedRoute] DOM content loaded:', document.readyState !== 'loading');
    }
  }, [loading, user, authTimeout, hostname, pathname]);
  
  // Add a timeout to prevent infinite loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log("[ProtectedRoute] Auth loading timeout reached after 3s - showing fallback");
        setAuthTimeout(true);
      }
    }, 3000); // 3 seconds for faster fallback
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Add a second timeout for error display if needed
  useEffect(() => {
    if (authTimeout && !user) {
      const errorTimer = setTimeout(() => {
        console.log("[ProtectedRoute] Auth error timeout reached after 2s - showing error");
        setShowingError(true);
      }, 2000);
      
      return () => clearTimeout(errorTimer);
    }
  }, [authTimeout, user]);
  
  // Add an effect to detect potential stuck states
  useEffect(() => {
    const stuckTimer = setTimeout(() => {
      if (loading) {
        console.warn("[ProtectedRoute] WARNING: Auth state has been loading for 10 seconds - potential stuck state detected");
      }
    }, 10000);
    
    return () => clearTimeout(stuckTimer);
  }, [loading]);
  
  // If still loading and haven't reached timeout, show loading indicator
  if (loading && !authTimeout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mb-4"></div>
        <p className="text-muted-foreground">Loading your wellness data...</p>
        <p className="text-xs text-muted-foreground mt-2">Domain: {hostname}</p>
        <p className="text-xs text-muted-foreground">Path: {pathname}</p>
        <p className="text-xs text-muted-foreground">Mount time: {mountTimestamp}</p>
        
        {/* Add diagnostic information for preview/editing domains */}
        {(hostname.includes('lovable.dev') || hostname.includes('lovable.app')) && (
          <div className="mt-4 p-3 border border-dashed border-amber-500 rounded bg-amber-50 text-amber-800 max-w-md mx-auto">
            <p className="font-semibold text-sm">Preview Diagnostic Information</p>
            <p className="text-xs mt-1">Browser: {navigator.userAgent.substring(0, 80)}</p>
            <p className="text-xs">Screen: {window.screen.width}x{window.screen.height}</p>
            <p className="text-xs">Window: {window.innerWidth}x{window.innerHeight}</p>
            <p className="text-xs mt-1">If screen appears blank, try refreshing the page</p>
          </div>
        )}
      </div>
    );
  }
  
  // If loading timed out or no user, redirect to auth
  if (!user) {
    console.log(`[ProtectedRoute] Redirecting to auth page from ${pathname}`, { 
      authTimeout, 
      hasUser: !!user, 
      hostname,
      time: new Date().toISOString()
    });
    return <Navigate to="/auth" replace />;
  }
  
  // User is authenticated, render children
  console.log(`[ProtectedRoute] User authenticated, rendering protected content on ${pathname}`);
  return <>{children}</>;
};

export default ProtectedRoute;
