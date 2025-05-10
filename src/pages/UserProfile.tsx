import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SendMessageModal from "@/components/SendMessageModal";
import { SocialLink } from "@/types/message";

interface UserProfileData {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  interests: string[] | null;
  goals: string[] | null;
  dreams: string[] | null;
  social_links: SocialLink[] | null;
  created_at: string;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        if (!userId) return;

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;
        if (!profileData) {
          toast({ title: "User not found", variant: "destructive" });
          return;
        }

        // Parse social_links from JSON
        let socialLinks: SocialLink[] = [];
        if (profileData.social_links) {
          if (typeof profileData.social_links === 'string') {
            try {
              socialLinks = JSON.parse(profileData.social_links);
            } catch (e) {
              socialLinks = [];
            }
          } else if (Array.isArray(profileData.social_links)) {
            // It's already an array, ensure each element has platform and url
            socialLinks = (profileData.social_links as any[])
              .filter((link: any) => 
                typeof link === 'object' && 
                link !== null && 
                'platform' in link && 
                'url' in link
              );
          }
        }

        // Set the user profile with parsed social links
        setUserProfile({
          ...profileData,
          social_links: socialLinks
        });

        // Check friend status if viewing someone else's profile
        if (user && userId !== user.id) {
          const { data: friendData } = await supabase
            .from('friends')
            .select('status')
            .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
            .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
            .single();

          if (friendData) {
            setFriendStatus(friendData.status as 'pending' | 'accepted');
          }
        }

      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Error loading profile",
          description: "Could not load the user profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId, user, toast]);

  // Friend request functions
  const handleFriendRequest = async () => {
    try {
      if (!user || !userId) return;
      
      const { error } = await supabase
        .from('friends')
        .insert([
          { user_id: user.id, friend_id: userId, status: 'pending' }
        ]);

      if (error) throw error;
      
      setFriendStatus('pending');
      toast({ title: "Friend request sent" });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error sending friend request",
        variant: "destructive",
      });
    }
  };

  if (loading) return (
    <Layout>
      <div className="container py-8 flex justify-center">
        <p>Loading profile...</p>
      </div>
    </Layout>
  );

  if (!userProfile) return (
    <Layout>
      <div className="container py-8 flex justify-center">
        <p>User not found</p>
      </div>
    </Layout>
  );

  const isOwnProfile = user && user.id === userProfile.id;
  
  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userProfile.avatar_url || undefined} />
                <AvatarFallback>
                  {userProfile.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <CardTitle className="text-2xl mb-2">
                  {userProfile.full_name || userProfile.username || 'Anonymous User'}
                </CardTitle>
                
                {userProfile.bio && (
                  <p className="text-muted-foreground mb-3">{userProfile.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
                  {!isOwnProfile && (
                    <>
                      <Button 
                        onClick={() => setShowMessageModal(true)}
                        variant="default"
                      >
                        Send Message
                      </Button>
                      
                      {friendStatus === 'none' && (
                        <Button 
                          onClick={handleFriendRequest}
                          variant="outline"
                        >
                          Add Friend
                        </Button>
                      )}
                      
                      {friendStatus === 'pending' && (
                        <Button 
                          disabled
                          variant="outline"
                        >
                          Request Pending
                        </Button>
                      )}
                      
                      {friendStatus === 'accepted' && (
                        <Badge variant="secondary">Friend</Badge>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="interests" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="interests">Interests</TabsTrigger>
                <TabsTrigger value="goals">Wellness Goals</TabsTrigger>
                <TabsTrigger value="dreams">Dreams</TabsTrigger>
                {userProfile.social_links && userProfile.social_links.length > 0 && (
                  <TabsTrigger value="social">Social Links</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="interests">
                {userProfile.interests && userProfile.interests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No interests shared yet.</p>
                )}
              </TabsContent>
              
              <TabsContent value="goals">
                {userProfile.goals && userProfile.goals.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.goals.map((goal, index) => (
                      <Badge key={index} variant="secondary">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No wellness goals shared yet.</p>
                )}
              </TabsContent>
              
              <TabsContent value="dreams">
                {userProfile.dreams && userProfile.dreams.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.dreams.map((dream, index) => (
                      <Badge key={index} variant="secondary">
                        {dream}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No dreams shared yet.</p>
                )}
              </TabsContent>
              
              {userProfile.social_links && userProfile.social_links.length > 0 && (
                <TabsContent value="social">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.social_links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-md hover:bg-accent transition-colors"
                      >
                        <div>
                          <p className="font-medium">{link.platform}</p>
                          <p className="text-sm text-primary truncate">{link.url}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Other content like user's posts or activity could go here */}
        
        {showMessageModal && userId && (
          <SendMessageModal
            isOpen={showMessageModal}
            onClose={() => setShowMessageModal(false)}
            recipientId={userId}
            recipientName={userProfile.full_name || userProfile.username || 'User'}
          />
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;
