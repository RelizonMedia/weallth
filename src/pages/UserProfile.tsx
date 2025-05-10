import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MessageSquare, UserPlus, UserCheck, Mail, Share2 } from "lucide-react";
import { SendMessageModal } from "@/components/SendMessageModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Json } from "@/integrations/supabase/types";
import { SocialLink } from "@/types/message";

interface UserProfileData {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  goals: string[] | null;
  interests: string[] | null;
  social_links: SocialLink[] | null;
  is_friend?: boolean;
  friend_request_status?: 'pending' | 'sent' | null;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  
  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url, bio, goals, interests, social_links')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;
        
        // If viewing someone else's profile (not current user)
        let friendStatus = null;
        let isFriend = false;
        
        if (user?.id && userId !== user.id) {
          // Check if they're friends
          const { data: friendData } = await supabase
            .from('friends')
            .select('status')
            .or(`(user_id.eq.${user.id},friend_id.eq.${userId}),(user_id.eq.${userId},friend_id.eq.${user.id})`)
            .eq('status', 'accepted');
            
          isFriend = friendData && friendData.length > 0;
          
          // Check for pending friend requests
          if (!isFriend) {
            // Check if current user sent a request to this profile
            const { data: sentRequest } = await supabase
              .from('friends')
              .select('status')
              .eq('user_id', user.id)
              .eq('friend_id', userId)
              .eq('status', 'pending')
              .maybeSingle();
              
            if (sentRequest) {
              friendStatus = 'sent';
            } else {
              // Check if this profile sent a request to current user
              const { data: receivedRequest } = await supabase
                .from('friends')
                .select('status')
                .eq('user_id', userId)
                .eq('friend_id', user.id)
                .eq('status', 'pending')
                .maybeSingle();
                
              if (receivedRequest) {
                friendStatus = 'pending';
              }
            }
          }
        }
        
        // Parse social_links from JSON to ensure it's the right type
        let parsedSocialLinks: SocialLink[] = [];
        
        if (profileData?.social_links) {
          // Handle either a string or an array
          if (typeof profileData.social_links === 'string') {
            try {
              parsedSocialLinks = JSON.parse(profileData.social_links);
            } catch (e) {
              parsedSocialLinks = [];
            }
          } else if (Array.isArray(profileData.social_links)) {
            // It's already an array, make sure each element has platform and url
            parsedSocialLinks = profileData.social_links
              .filter((link: any) => 
                typeof link === 'object' && 
                link !== null && 
                'platform' in link && 
                'url' in link
              ) as SocialLink[];
          }
        }
        
        setProfile({
          ...profileData,
          social_links: parsedSocialLinks,
          is_friend: isFriend,
          friend_request_status: friendStatus
        } as UserProfileData);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Failed to load profile",
          description: "This user profile could not be loaded",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, user, toast]);

  const handleSendFriendRequest = async () => {
    if (!user || !profile) return;
    
    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: profile.id,
          status: 'pending'
        });
      
      if (error) throw error;
      
      setProfile({
        ...profile,
        friend_request_status: 'sent'
      });
      
      toast({
        title: "Friend request sent",
        description: `A friend request has been sent to ${profile.username || 'this user'}`,
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Failed to send friend request",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleAcceptFriendRequest = async () => {
    if (!user || !profile) return;
    
    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('user_id', profile.id)
        .eq('friend_id', user.id);
      
      if (error) throw error;
      
      setProfile({
        ...profile,
        is_friend: true,
        friend_request_status: null
      });
      
      toast({
        title: "Friend request accepted",
        description: `You are now friends with ${profile.username || 'this user'}`,
      });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Failed to accept friend request",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleShareProfile = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: `${profile?.full_name || profile?.username || 'User'}'s Profile on Weallth`,
        text: `Check out this wellness profile on Weallth!`,
        url: url,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast({
          title: "Link copied to clipboard",
          description: "You can now share this profile with others",
        });
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-3xl py-8">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container max-w-3xl py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <p className="mb-6">The user profile you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/community">Back to Community</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isCurrentUser = user?.id === profile.id;

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-xl">
                  {profile.username?.[0]?.toUpperCase() || profile.full_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <CardTitle className="text-2xl md:text-3xl">{profile.full_name || profile.username || 'Anonymous User'}</CardTitle>
                {profile.username && profile.username !== profile.full_name && (
                  <CardDescription className="text-lg">@{profile.username}</CardDescription>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {!isCurrentUser && (
                  <>
                    {profile.is_friend ? (
                      <Button variant="outline" className="flex items-center gap-2">
                        <UserCheck size={16} />
                        <span>Friends</span>
                      </Button>
                    ) : profile.friend_request_status === 'sent' ? (
                      <Button variant="outline" disabled className="flex items-center gap-2">
                        <UserCheck size={16} />
                        <span>Request Sent</span>
                      </Button>
                    ) : profile.friend_request_status === 'pending' ? (
                      <Button onClick={handleAcceptFriendRequest} className="flex items-center gap-2">
                        <UserCheck size={16} />
                        <span>Accept Request</span>
                      </Button>
                    ) : (
                      <Button onClick={handleSendFriendRequest} variant="outline" className="flex items-center gap-2">
                        <UserPlus size={16} />
                        <span>Add Friend</span>
                      </Button>
                    )}
                    
                    <Button 
                      onClick={() => setMessageModalOpen(true)} 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare size={16} />
                      <span>Message</span>
                    </Button>
                  </>
                )}
                
                <Button onClick={handleShareProfile} variant="outline" className="flex items-center gap-2">
                  <Share2 size={16} />
                  <span>Share</span>
                </Button>
                
                {isCurrentUser && (
                  <Button 
                    onClick={() => navigate('/profile')} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                {profile.bio && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Bio</h3>
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </div>
                )}
                
                {profile.interests && profile.interests.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile.social_links && profile.social_links.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Social Media</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.social_links.map((link, index) => (
                        <a 
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {(!profile.bio && (!profile.interests || profile.interests.length === 0) && (!profile.social_links || profile.social_links.length === 0)) && (
                  <p className="text-muted-foreground italic">No profile information has been added yet.</p>
                )}
              </TabsContent>
              
              <TabsContent value="goals" className="space-y-4">
                {profile.goals && profile.goals.length > 0 ? (
                  <div className="space-y-4">
                    {profile.goals.map((goal, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h4 className="font-medium">{goal}</h4>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No goals have been added yet.</p>
                )}
              </TabsContent>
              
              <TabsContent value="activities" className="space-y-4">
                <p className="text-muted-foreground italic">Recent activity will appear here.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <SendMessageModal
        open={messageModalOpen}
        onOpenChange={setMessageModalOpen}
        recipientId={profile.id}
        recipientName={profile.full_name || profile.username || 'User'}
      />
    </Layout>
  );
};

export default UserProfile;
