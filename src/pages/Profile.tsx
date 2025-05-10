import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "lucide-react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SocialLink } from "@/types/message";

// Profile form schema
const profileFormSchema = z.object({
  username: z.string().min(3).max(50).optional().nullable(),
  full_name: z.string().max(100).optional().nullable(),
  avatar_url: z.string().url().optional().nullable().or(z.literal('')),
  bio: z.string().max(500).optional().nullable(),
  interests: z.array(z.string()).optional().default([]),
  goals: z.array(z.string()).optional().default([]),
  social_links: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url()
    })
  ).optional().default([])
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const { user, ensureProfile } = useAuth();
  const { toast } = useToast();

  // Initialize form with default empty values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      full_name: "",
      avatar_url: "",
      bio: "",
      interests: [],
      goals: [],
      social_links: []
    }
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // First ensure profile exists
      await ensureProfile();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, bio, interests, goals, dreams, social_links')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error loading profile",
          description: "Please try again later",
          variant: "destructive",
        });
        return;
      }
      
      if (data) {
        // Parse social_links from JSON if necessary
        let socialLinks: SocialLink[] = [];
        
        if (data.social_links) {
          if (typeof data.social_links === 'string') {
            try {
              socialLinks = JSON.parse(data.social_links as string);
            } catch (e) {
              socialLinks = [];
            }
          } else if (Array.isArray(data.social_links)) {
            // Properly cast Json[] to SocialLink[]
            socialLinks = (data.social_links as unknown as SocialLink[]).filter(link => 
              typeof link === 'object' && 
              link !== null && 
              'platform' in link && 
              'url' in link
            );
          }
        }
        
        // Reset form with the loaded data
        form.reset({
          username: data.username || "",
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || "",
          bio: data.bio || "",
          interests: data.interests || [],
          goals: data.goals || [],
          social_links: socialLinks || []
        });
      } else {
        // If no profile data found, use default values
        form.reset({
          username: user.email?.split('@')[0] || "",
          full_name: "",
          avatar_url: "",
          bio: "",
          interests: [],
          goals: [],
          social_links: []
        });
      }
    } catch (error) {
      console.error("Error in loadProfile:", error);
      toast({
        title: "Error loading profile",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Save profile data
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: data.username,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          bio: data.bio,
          interests: data.interests,
          goals: data.goals,
          social_links: data.social_links
        });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for managing arrays
  const addInterest = () => {
    if (!newInterest.trim()) return;
    const currentInterests = form.getValues("interests") || [];
    form.setValue("interests", [...currentInterests, newInterest.trim()]);
    setNewInterest("");
  };

  const removeInterest = (interest: string) => {
    const currentInterests = form.getValues("interests") || [];
    form.setValue(
      "interests",
      currentInterests.filter((i) => i !== interest)
    );
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    const currentGoals = form.getValues("goals") || [];
    form.setValue("goals", [...currentGoals, newGoal.trim()]);
    setNewGoal("");
  };

  const removeGoal = (goal: string) => {
    const currentGoals = form.getValues("goals") || [];
    form.setValue(
      "goals",
      currentGoals.filter((g) => g !== goal)
    );
  };

  const addSocialLink = () => {
    if (!newSocialPlatform.trim() || !newSocialUrl.trim()) return;
    const currentLinks = form.getValues("social_links") || [];
    form.setValue("social_links", [
      ...currentLinks,
      {
        platform: newSocialPlatform.trim(),
        url: newSocialUrl.trim()
      }
    ]);
    setNewSocialPlatform("");
    setNewSocialUrl("");
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = form.getValues("social_links") || [];
    form.setValue(
      "social_links",
      currentLinks.filter((_, i) => i !== index)
    );
  };

  
  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="avatar_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture URL</FormLabel>
                      <div className="flex items-center gap-4 mb-2">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={field.value || undefined} />
                          <AvatarFallback>
                            {form.getValues("username")?.[0]?.toUpperCase() || 
                             form.getValues("full_name")?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for your profile picture
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself"
                          className="min-h-[120px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description about yourself
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {form.watch("interests")?.map((interest, index) => (
                    <Badge key={index} className="flex items-center gap-1 px-3 py-1">
                      {interest}
                      <button 
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={addInterest}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Goals</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {form.watch("goals")?.map((goal, index) => (
                    <Badge key={index} className="flex items-center gap-1 px-3 py-1">
                      {goal}
                      <button 
                        type="button"
                        onClick={() => removeGoal(goal)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a goal"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addGoal();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={addGoal}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3 mb-4">
                  {form.watch("social_links")?.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="font-medium">{link.platform}</div>
                        <div className="text-sm text-muted-foreground">{link.url}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSocialLink(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Platform"
                    value={newSocialPlatform}
                    onChange={(e) => setNewSocialPlatform(e.target.value)}
                    className="col-span-1"
                  />
                  <Input
                    placeholder="URL"
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    className="col-span-1"
                  />
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={addSocialLink}
                    className="col-span-1"
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default Profile;
