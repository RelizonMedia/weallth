
import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  ensureProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authInitialized, setAuthInitialized] = useState(false);

  // Capture current hostname for logging
  const hostname = window.location.hostname;
  const isProductionDomain = hostname === 'weallth.ai';
  
  // Debug function to log auth state in a consistent format
  const logAuthState = (message: string, data?: any) => {
    const logPrefix = `[AuthContext] [${hostname}]`;
    if (data) {
      console.log(`${logPrefix} ${message}`, data);
    } else {
      console.log(`${logPrefix} ${message}`);
    }
  };

  // Function to ensure user profile exists
  const ensureProfile = async () => {
    if (!user) {
      logAuthState("ensureProfile called but no user is set");
      return;
    }
    
    try {
      logAuthState(`Ensuring profile exists for user:`, user.id);
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid error
      
      // If profile doesn't exist, create it
      if (!existingProfile && !fetchError) {
        logAuthState("Profile doesn't exist, creating new profile");
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.email?.split('@')[0] || null,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            bio: null
          });
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          logAuthState('Profile created successfully');
        }
      } else if (fetchError) {
        console.error("Error checking for existing profile:", fetchError);
      } else {
        logAuthState("Profile exists:", existingProfile);
      }
    } catch (error) {
      console.error('Error in ensureProfile:', error);
    }
  };

  useEffect(() => {
    logAuthState(`Initializing auth context on ${hostname}`);
    
    try {
      // Set up auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, sessionData) => {
          logAuthState("Auth state changed:", event);
          
          // Using setTimeout to avoid potential deadlock with supabase auth state management
          setTimeout(() => {
            setSession(sessionData);
            setUser(sessionData?.user ?? null);
            
            if (event === 'SIGNED_IN' && sessionData?.user) {
              logAuthState("User signed in, ensuring profile exists");
              // Ensure profile exists when user signs in
              setTimeout(async () => {
                await ensureProfile();
              }, 0);
            }
            
            if (event === 'SIGNED_OUT') {
              logAuthState("User signed out, redirecting to auth");
              navigate('/auth');
            }
          }, 0);
        }
      );

      // Then check for existing session
      logAuthState("Checking for existing session");
      const checkSession = async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error getting session:", error);
            setLoading(false);
            setAuthInitialized(true);
            return;
          }
          
          logAuthState("Existing session check result:", session ? "Found session" : "No session");
          
          // Set state after a short timeout to avoid potential state update conflicts
          setTimeout(() => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              logAuthState("Found existing user session, ensuring profile exists");
              // Ensure profile exists for existing session
              setTimeout(async () => {
                await ensureProfile();
              }, 0);
            } else {
              // If on production domain and no session, redirect to auth immediately
              if (isProductionDomain && window.location.pathname !== '/auth') {
                logAuthState("No session on production domain - redirecting to auth page");
                navigate('/auth');
              }
            }
            
            setLoading(false);
            setAuthInitialized(true);
          }, 0);
        } catch (err) {
          console.error("Critical error checking session:", err);
          setLoading(false);
          setAuthInitialized(true);
        }
      };
      
      checkSession();

      return () => {
        try {
          logAuthState("Cleaning up auth subscription");
          subscription.unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from auth:", error);
        }
      };
    } catch (error) {
      console.error("Critical error in auth initialization:", error);
      setLoading(false);
      setAuthInitialized(true);
    }
  }, [navigate, hostname, isProductionDomain]);

  const signOut = async () => {
    try {
      logAuthState("Signing out user");
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        duration: 3000,
      });
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const refreshSession = async () => {
    try {
      logAuthState("Refreshing session");
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };

  // If auth fails to initialize after a timeout, show app anyway
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!authInitialized) {
        logAuthState("Auth initialization timeout - forcing completion");
        setLoading(false);
        setAuthInitialized(true);
      }
    }, 3000); // 3 seconds timeout for faster response

    return () => clearTimeout(timeout);
  }, [authInitialized]);

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, refreshSession, ensureProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
