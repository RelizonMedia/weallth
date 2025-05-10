
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Debug values specific to the domain
  const currentDomain = window.location.hostname;
  const isProdDomain = currentDomain === 'weallth.ai';
  const currentPath = window.location.pathname;
  const sessionCheckCount = React.useRef(0);
  
  // Add debug timestamp to track rendering
  const mountTime = React.useRef(new Date().toISOString());
  console.log(`Auth page mounted at ${mountTime.current} on domain: ${currentDomain}`);
  console.log(`Is production domain: ${isProdDomain}`);
  console.log(`Current URL path: ${currentPath}`);
  console.log(`Current URL search params: ${window.location.search}`);
  
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const checkNumber = ++sessionCheckCount.current;
        console.log(`[Auth Page] Checking session... (attempt #${checkNumber})`);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[Auth Page] Error checking session:", error);
          setInitialLoading(false);
          return;
        }
        
        console.log("[Auth Page] Session check result:", session ? "User already logged in" : "No session found");
        console.log("[Auth Page] Session details:", session ? {
          userId: session.user?.id,
          expiresAt: session.expires_at,
          hasUser: !!session.user
        } : "null");
        
        if (session) {
          console.log(`[Auth Page] Redirecting to home page from auth page (attempt #${checkNumber})`);
          navigate("/");
          return;
        }
      } catch (err) {
        console.error("[Auth Page] Exception during session check:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    
    checkSession();
    
    // Additional debug: Log when auth page unmounts
    return () => {
      console.log(`[Auth Page] Unmounting auth page after ${(new Date().getTime() - new Date(mountTime.current).getTime()) / 1000}s`);
    }
  }, [navigate, isProdDomain, mountTime]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please provide both email and password",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log("[Auth Page] Attempting signup with email:", email);
      console.log("[Auth Page] Current domain during signup:", currentDomain);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: email.split('@')[0],
            username: email.split('@')[0],
          }
        }
      });

      if (error) throw error;

      if (data && data.user) {
        console.log("[Auth Page] Signup successful:", data.user.id);
        console.log("[Auth Page] Session available:", !!data.session);
        
        toast({
          title: "Account created successfully",
          description: data.session ? "You are now logged in!" : "Please check your email for confirmation",
          duration: 5000,
        });
        
        if (data.session) {
          // If session is available immediately (email confirmation disabled in Supabase)
          console.log("[Auth Page] Session available, redirecting to home");
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("[Auth Page] Signup error:", error);
      toast({
        title: "Error signing up",
        description: error.error_description || error.message || "An error occurred during sign up",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please provide both email and password",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log("[Auth Page] Attempting signin with email:", email);
      console.log("[Auth Page] Current domain during signin:", currentDomain);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        console.log("[Auth Page] Signin successful, session established");
        console.log("[Auth Page] User ID:", data.user?.id);
        console.log("[Auth Page] Session expiry:", new Date(data.session.expires_at! * 1000).toISOString());
        console.log("[Auth Page] Redirecting to home");
        
        toast({
          title: "Signed in successfully",
          duration: 3000,
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("[Auth Page] Signin error:", error);
      toast({
        title: "Error signing in",
        description: error.error_description || error.message || "Check your credentials and try again",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
          <p className="text-xs text-muted-foreground mt-2">Domain: {currentDomain}</p>
          <p className="text-xs text-muted-foreground">Mount time: {mountTime.current}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl text-wellness-purple">
            We<span className="text-wellness-teal">allth</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Track and improve your wellness journey</p>
        </div>

        <Card className="border shadow-lg">
          <Tabs defaultValue="signin">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password" className="flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Password
                      </Label>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <Button disabled={loading} className="w-full" type="submit">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" /> Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      className="bg-background"
                    />
                  </div>
                  <Button disabled={loading} className="w-full" type="submit">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing up...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
              <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
              <p className="text-xs">
                Secure sign-in powered by Supabase Auth on {currentDomain}
              </p>
              <p className="text-xs italic">
                Debug info: Page mounted at {mountTime.current}
              </p>
            </CardFooter>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
