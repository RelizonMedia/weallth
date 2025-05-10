
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

  // Function to ensure user profile exists
  const ensureProfile = async () => {
    if (!user) return;
    
    try {
      console.log("Ensuring profile exists for user:", user.id);
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid error
      
      // If profile doesn't exist, create it
      if (!existingProfile && !fetchError) {
        console.log("Profile doesn't exist, creating new profile");
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: user.email?.split('@')[0] || null,
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            bio: null,
            interests: [],
            goals: [],
            dreams: [],
            social_links: []
          });
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('Profile created successfully');
        }
      } else if (fetchError) {
        console.error("Error checking for existing profile:", fetchError);
      } else {
        console.log("Profile exists:", existingProfile);
      }
    } catch (error) {
      console.error('Error in ensureProfile:', error);
    }
  };

  useEffect(() => {
    // Capture current hostname for logging
    const hostname = window.location.hostname;
    console.log(`Initializing auth context on ${hostname}`);
    
    try {
      // Set up auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state changed:", event);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log("User signed in, ensuring profile exists");
            // Ensure profile exists when user signs in
            await ensureProfile();
          }
          
          if (event === 'SIGNED_OUT') {
            console.log("User signed out, redirecting to auth");
            navigate('/auth');
          }
        }
      );

      // Then check for existing session
      console.log("Checking for existing session");
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        console.log("Existing session check result:", session ? "Found session" : "No session");
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log("Found existing user session, ensuring profile exists");
          // Ensure profile exists for existing session
          await ensureProfile();
        } else {
          // If on production domain and no session, redirect to auth immediately
          const isProductionDomain = window.location.hostname === 'weallth.ai';
          if (isProductionDomain && window.location.pathname !== '/auth') {
            console.log("No session on production domain - redirecting to auth page");
            navigate('/auth');
          }
        }
        
        setLoading(false);
        setAuthInitialized(true);
      }).catch(err => {
        console.error("Error getting session:", err);
        setLoading(false);
        setAuthInitialized(true);
      });

      return () => {
        try {
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
  }, [navigate]);

  const signOut = async () => {
    try {
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
      const { data } = await supabase.auth.getSession();
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
        console.log("Auth initialization timeout - forcing completion");
        setLoading(false);
        setAuthInitialized(true);
      }
    }, 3000); // Reduced from 5 seconds to 3 seconds for faster response

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
