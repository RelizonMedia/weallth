import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Json } from "@/integrations/supabase/types";
import { SocialLink } from "@/types/message";

interface ProfileData {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  interests: string[] | null;
  goals: string[] | null;
  social_links: SocialLink[] | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    username: null,
    full_name: null,
    avatar_url: null,
    bio: null,
    interests: [],
    goals: [],
    social_links: []
  });
  
  // New input states
  const [newInterest, setNewInterest] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url, bio, interests, goals, social_links')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        // Parse social_links from JSON to the expected format
        let parsedSocialLinks: SocialLink[] = [];
        
        if (data.social_links) {
          // Handle either a string or an array
          if (typeof data.social_links === 'string') {
            try {
              parsedSocialLinks = JSON.parse(data.social_links);
            } catch (e) {
              parsedSocialLinks = [];
            }
          } else if (Array.isArray(data.social_links)) {
            // It's already an array, ensure each element has platform and url
            parsedSocialLinks = data.social_links
              .filter((link: any) => 
                typeof link === 'object' && 
                link !== null && 
                'platform' in link && 
                'url' in link
              ) as SocialLink[];
          }
        }

        setProfile({
          username: data.username,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          bio: data.bio,
          interests: data.interests || [],
          goals: data.goals || [],
          social_links: parsedSocialLinks
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Error loading profile",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user, toast]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      if (!user) return;

      // Convert SocialLinks array to a JSON structure for storage
      const updates = {
        id: user.id,
        username: profile.username,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        interests: profile.interests,
        goals: profile.goals,
        social_links: profile.social_links as unknown as Json, // Type assertion for compatibility
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    
    setProfile(prev => ({
      ...prev,
      interests: [...(prev.interests || []), newInterest.trim()]
    }));
    setNewInterest("");
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: (prev.interests || []).filter(item => item !== interest)
    }));
  };

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    
    setProfile(prev => ({
      ...prev,
      goals: [...(prev.goals || []), newGoal.trim()]
    }));
    setNewGoal("");
  };

  const handleRemoveGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      goals: (prev.goals || []).filter(item => item !== goal)
    }));
  };

  const handleAddSocialLink = () => {
    if (!newSocialPlatform.trim() || !newSocialUrl.trim()) return;
    
    // Ensure URL has protocol
    let url = newSocialUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    setProfile(prev => ({
      ...prev,
      social_links: [...(prev.social_links || []), {
        platform: newSocialPlatform.trim(),
        url
      }]
    }));
    setNewSocialPlatform("");
    setNewSocialUrl("");
  };

  const handleRemoveSocialLink = (index: number) => {
    setProfile(prev => ({
      ...prev,
      social_links: (prev.social_links || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Complete your profile to help others connect with you
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={updateProfile}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mx-6 mt-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="interests">Interests & Goals</TabsTrigger>
                <TabsTrigger value="social">Social Links</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <CardContent className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback>
                        {profile.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={user?.email || ''} 
                        disabled 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={profile.username || ''} 
                        onChange={(e) => setProfile({...profile, username: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={profile.full_name || ''} 
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell others about yourself..."
                        value={profile.bio || ''} 
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="interests">
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Interests</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {profile.interests && profile.interests.map((interest, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {interest}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveInterest(interest)}
                              className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {(!profile.interests || profile.interests.length === 0) && (
                          <p className="text-sm text-muted-foreground">Add some interests to help connect with like-minded individuals</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add an interest..."
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddInterest();
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddInterest}
                          disabled={!newInterest.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Wellness Goals</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {profile.goals && profile.goals.map((goal, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {goal}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveGoal(goal)}
                              className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {(!profile.goals || profile.goals.length === 0) && (
                          <p className="text-sm text-muted-foreground">Add some wellness goals to share your journey</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a wellness goal..."
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddGoal();
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddGoal}
                          disabled={!newGoal.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="social">
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Social Media Links</Label>
                    <div className="space-y-2 mb-4">
                      {profile.social_links && profile.social_links.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">{link.platform}</p>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {link.url}
                            </a>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSocialLink(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {(!profile.social_links || profile.social_links.length === 0) && (
                        <p className="text-sm text-muted-foreground">Add your social media profiles to connect with others</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Input
                          id="platform"
                          placeholder="e.g. Instagram, Twitter, LinkedIn"
                          value={newSocialPlatform}
                          onChange={(e) => setNewSocialPlatform(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                          id="url"
                          placeholder="e.g. https://instagram.com/username"
                          value={newSocialUrl}
                          onChange={(e) => setNewSocialUrl(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleAddSocialLink}
                      disabled={!newSocialPlatform.trim() || !newSocialUrl.trim()}
                      className="w-full md:w-auto"
                    >
                      Add Social Link
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex justify-between border-t p-6">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setActiveTab(activeTab === "basic" ? "interests" : activeTab === "interests" ? "social" : "basic")}
              >
                {activeTab === "basic" ? "Next: Interests" : activeTab === "interests" ? "Next: Social" : "Back to Basics"}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
