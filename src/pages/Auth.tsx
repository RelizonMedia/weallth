
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debug values specific to the production domain
  const isProdDomain = window.location.hostname === 'weallth.ai';
  
  useEffect(() => {
    console.log(`Auth page mounted on domain: ${window.location.hostname}`);
    console.log(`Is production domain: ${isProdDomain}`);
    
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Auth page session check result:", session ? "User already logged in" : "No session found");
      
      if (session) {
        console.log("Redirecting to home page from auth page");
        navigate("/");
      }
      
      setInitialLoading(false);
    }).catch(err => {
      console.error("Error checking session in Auth page:", err);
      setInitialLoading(false);
    });
  }, [navigate, isProdDomain]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Attempting signup with email:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data) {
        console.log("Signup successful:", data);
        toast({
          title: "Account created successfully",
          description: "Please check your email for confirmation",
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error signing up",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Attempting signin with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        console.log("Signin successful, redirecting to home");
        navigate("/");
        toast({
          title: "Signed in successfully",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Signin error:", error);
      toast({
        title: "Error signing in",
        description: error.message || "Check your credentials and try again",
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
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">Password</Label>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button disabled={loading} className="w-full" type="submit">
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button disabled={loading} className="w-full" type="submit">
                    {loading ? "Signing up..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </CardFooter>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
