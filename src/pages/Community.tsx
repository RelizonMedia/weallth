import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageCircle, Trophy, PartyPopper, Search, Users, Plus, User, Lock, Folder, Globe, FolderPlus, UserPlus, Share, Image, Video, Share2, Facebook, Instagram, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateWellnessSpace from "@/components/CreateWellnessSpace";
import InviteFriendsModal from "@/components/InviteFriendsModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Mock data for communities and posts
const mockCommunities = [
  { id: 1, name: "Morning Runners", members: 156, isPrivate: false, joined: true },
  { id: 2, name: "Meditation Masters", members: 89, isPrivate: false, joined: false },
  { id: 3, name: "Healthy Cooking", members: 224, isPrivate: false, joined: true },
  { id: 4, name: "Yoga Enthusiasts", members: 112, isPrivate: false, joined: false },
  { id: 5, name: "Mental Health Support", members: 67, isPrivate: true, joined: false },
  { id: 6, name: "Sleep Improvement", members: 43, isPrivate: false, joined: false },
];

const mockPosts = [
  { 
    id: 1, 
    author: "Sarah J.", 
    content: "Just completed a 5km run in 25 minutes! A personal best for me. Small steps lead to big changes!",
    likes: 24, 
    comments: 7, 
    celebrations: 12,
    date: "2 hours ago",
    type: "progress",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    }
  },
  { 
    id: 2, 
    author: "Mike T.", 
    content: "Pro tip: Adding 10 minutes of meditation to your morning routine can dramatically improve your focus for the entire day.",
    likes: 45, 
    comments: 12, 
    celebrations: 8,
    date: "Yesterday",
    type: "tip"
  },
  { 
    id: 3, 
    author: "Emma L.", 
    content: "I've been consistent with my wellness tracking for 30 days straight! The insights I've gained about my sleep patterns have been eye-opening.",
    likes: 32, 
    comments: 5, 
    celebrations: 21,
    date: "2 days ago",
    type: "win",
    media: {
      type: "video",
      url: "https://player.vimeo.com/progressive_redirect/playback/745859902/rendition/720p/file.mp4?loc=external"
    }
  }
];

const mockPartners = [
  { id: 1, name: "Jessica M.", goals: ["Morning workouts", "Mindful eating"], compatibility: 87 },
  { id: 2, name: "David R.", goals: ["Weight training", "Stress reduction"], compatibility: 76 },
  { id: 3, name: "Alex T.", goals: ["Better sleep", "Daily meditation"], compatibility: 92 },
  { id: 4, name: "Sophia K.", goals: ["Healthy cooking", "Running"], compatibility: 81 },
];

const Community = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("progress");
  const [searchQuery, setSearchQuery] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState("community");
  const [createSpaceOpen, setCreateSpaceOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [userSpaces, setUserSpaces] = useState<any[]>([]);
  const [mediaType, setMediaType] = useState<"none" | "image" | "video">("none");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const fileType = file.type.split('/')[0];
    if ((mediaType === "image" && fileType !== "image") || 
        (mediaType === "video" && fileType !== "video")) {
      toast({
        title: "Invalid file type",
        description: `Please select a ${mediaType} file.`,
        variant: "destructive",
      });
      return;
    }
    
    setMediaFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType("none");
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim() === "") {
      toast({
        title: "Post cannot be empty",
        description: "Please write something to share with the community",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post shared!",
      description: "Your post has been shared with the community",
    });

    // In a real app, we'd save the post to the database
    // For now, we'll just clear the form
    setPostContent("");
    clearMedia();
  };

  const handleCelebration = (postId: number) => {
    toast({
      title: "Celebration sent!",
      description: "You celebrated someone's achievement",
    });
  };

  const handleJoinCommunity = (communityId: number) => {
    toast({
      title: "Community joined!",
      description: "You have successfully joined the community",
    });
  };

  const handleConnectPartner = (partnerId: number) => {
    toast({
      title: "Connection request sent!",
      description: "Your request has been sent to the potential accountability partner",
    });
  };

  const handleInviteFriends = (spaceName: string, spaceId: string | null) => {
    setSelectedSpace(spaceName);
    setSelectedSpaceId(spaceId);
    setInviteModalOpen(true);
  };

  const handleSpaceCreated = (newSpace: any) => {
    setUserSpaces([newSpace, ...userSpaces]);
  };

  const handleShareToSocial = (platform: string, post: any) => {
    const shareText = `Check out my wellness update: ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`;
    const shareUrl = window.location.href;
    
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing links, but we can notify the user
        toast({
          title: "Instagram Sharing",
          description: "To share to Instagram, screenshot your achievement and upload it to your Instagram Story or Post.",
        });
        return;
      default:
        // Generic share dialog (if supported by browser)
        if (navigator.share) {
          navigator.share({
            title: 'My Wellness Journey',
            text: shareText,
            url: shareUrl,
          }).catch((error) => console.log('Error sharing:', error));
          return;
        } else {
          // Fallback if Web Share API is not supported
          shareLink = `mailto:?subject=Check%20out%20my%20wellness%20journey&body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        }
    }
    
    // Open sharing link in a new window
    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
    }
    
    toast({
      title: "Sharing to " + platform,
      description: `Your ${post.type === 'win' ? 'achievement' : 'post'} is being shared.`,
    });
  };

  const filteredCommunities = mockCommunities.filter(community => 
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container max-w-5xl py-8">
        <h1 className="text-3xl font-bold mb-2">Wellness Community</h1>
        <p className="text-muted-foreground mb-6">Connect, share, and grow together on your wellness journey</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="spaces">Wellness Spaces</TabsTrigger>
            <TabsTrigger value="partners">Accountability Partners</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Post creation card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share with the community</CardTitle>
                <CardDescription>
                  Share your progress, tips, or celebrate wins with the wellness community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div>
                    <Textarea 
                      placeholder="What's on your wellness journey today?" 
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Media upload controls */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        type="button" 
                        variant={mediaType === "image" ? "default" : "outline"}
                        onClick={() => {
                          setMediaType(mediaType === "image" ? "none" : "image");
                          clearMedia();
                        }}
                        className="flex items-center"
                      >
                        <Image className="mr-2 h-4 w-4" />
                        Add Image
                      </Button>
                      <Button 
                        type="button" 
                        variant={mediaType === "video" ? "default" : "outline"}
                        onClick={() => {
                          setMediaType(mediaType === "video" ? "none" : "video");
                          clearMedia();
                        }}
                        className="flex items-center"
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Add Video
                      </Button>
                    </div>

                    {mediaType !== "none" && (
                      <div className="border border-dashed border-gray-300 rounded-md p-4">
                        <Input
                          type="file"
                          accept={mediaType === "image" ? "image/*" : "video/*"}
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {mediaType === "image" 
                            ? "Supported formats: JPG, PNG, GIF (max 5MB)" 
                            : "Supported formats: MP4, WebM (max 20MB)"}
                        </p>
                      </div>
                    )}

                    {mediaPreview && (
                      <div className="mt-2 border rounded-md p-2">
                        {mediaType === "image" && (
                          <img 
                            src={mediaPreview} 
                            alt="Preview" 
                            className="max-h-40 mx-auto rounded-md" 
                          />
                        )}
                        {mediaType === "video" && (
                          <video 
                            src={mediaPreview} 
                            controls 
                            className="w-full max-h-80" 
                          />
                        )}
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={clearMedia}
                          className="mt-2"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button 
                      type="button" 
                      variant={postType === "progress" ? "default" : "outline"}
                      onClick={() => setPostType("progress")}
                      className="flex items-center"
                    >
                      <Trophy className="mr-2 h-4 w-4" />
                      Progress Update
                    </Button>
                    <Button 
                      type="button" 
                      variant={postType === "tip" ? "default" : "outline"}
                      onClick={() => setPostType("tip")}
                      className="flex items-center"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Wellness Tip
                    </Button>
                    <Button 
                      type="button" 
                      variant={postType === "win" ? "default" : "outline"}
                      onClick={() => setPostType("win")}
                      className="flex items-center"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Celebrate Win
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Label className="mr-2">Share with:</Label>
                      <select 
                        className="border rounded p-1"
                        value={privacyLevel}
                        onChange={(e) => setPrivacyLevel(e.target.value)}
                      >
                        <option value="private">Private</option>
                        <option value="friends">Friends only</option>
                        <option value="community">Everyone</option>
                      </select>
                    </div>
                    <Button type="submit">Share</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Community posts feed */}
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{post.author}</p>
                          <p className="text-xs text-muted-foreground">{post.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {post.type === "progress" && <Trophy className="h-4 w-4 text-blue-500" />}
                        {post.type === "tip" && <MessageCircle className="h-4 w-4 text-emerald-500" />}
                        {post.type === "win" && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                        <span className="text-xs ml-1 capitalize text-muted-foreground">{post.type}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{post.content}</p>
                    
                    {/* Display media if available */}
                    {post.media && (
                      <div className="rounded-md overflow-hidden border">
                        {post.media.type === "image" && (
                          <img 
                            src={post.media.url}
                            alt="Post media" 
                            className="w-full object-cover max-h-80" 
                          />
                        )}
                        {post.media.type === "video" && (
                          <video 
                            src={post.media.url}
                            controls 
                            className="w-full max-h-80" 
                          />
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between flex-wrap gap-2">
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <MessageCircle className="mr-1 h-4 w-4" />
                        <span>{post.comments}</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCelebration(post.id)}
                        className="flex items-center"
                      >
                        <PartyPopper className="mr-1 h-4 w-4 text-purple-500" />
                        Celebrate
                      </Button>
                    </div>
                    
                    {/* Social sharing */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Share2 className="mr-1 h-4 w-4" />
                          Share
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2" align="end">
                        <div className="flex flex-col space-y-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center justify-start"
                            onClick={() => handleShareToSocial("facebook", post)}
                          >
                            <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                            Facebook
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center justify-start"
                            onClick={() => handleShareToSocial("twitter", post)}
                          >
                            <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                            Twitter
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center justify-start"
                            onClick={() => handleShareToSocial("instagram", post)}
                          >
                            <Instagram className="mr-2 h-4 w-4 text-pink-600" />
                            Instagram
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="spaces" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search spaces..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setCreateSpaceOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-2" /> Create Space
              </Button>
            </div>

            {userSpaces.length > 0 && (
              <>
                <h3 className="text-lg font-medium mt-6 mb-3">Your Spaces</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userSpaces.map((space: any) => (
                    <Card key={space.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center">
                            {space.name}
                            {space.isPrivate && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
                            {!space.isPrivate && <Globe className="ml-2 h-4 w-4 text-muted-foreground" />}
                          </CardTitle>
                        </div>
                        <CardDescription className="flex items-center">
                          <Users className="h-3 w-3 mr-1" /> {space.members} member{space.members !== 1 ? 's' : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{space.description || "No description provided."}</p>
                      </CardContent>
                      <CardFooter className="gap-2">
                        <Button 
                          variant="default" 
                          className="w-full"
                        >
                          View Space
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-shrink-0"
                          onClick={() => handleInviteFriends(space.name, space.id)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            )}

            <h3 className="text-lg font-medium mt-6 mb-3">Discover Spaces</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCommunities.map((community) => (
                <Card key={community.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center">
                        {community.name}
                        {community.isPrivate && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
                        {!community.isPrivate && <Globe className="ml-2 h-4 w-4 text-muted-foreground" />}
                      </CardTitle>
                      {community.joined ? (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Joined</span>
                      ) : null}
                    </div>
                    <CardDescription className="flex items-center">
                      <Users className="h-3 w-3 mr-1" /> {community.members} members
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    {!community.joined && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleJoinCommunity(community.id)}
                        className="w-full"
                      >
                        Join Space
                      </Button>
                    )}
                    {community.joined && (
                      <Button 
                        variant="default" 
                        className="w-full"
                      >
                        View Space
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Find Your Wellness Accountability Partner</h3>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" /> Advanced Search
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockPartners.map((partner) => (
                <Card key={partner.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          <User className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium px-2 py-1 rounded-full">
                        {partner.compatibility}% match
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium mb-1">Wellness Goals:</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {partner.goals.map((goal, index) => (
                        <span key={index} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleConnectPartner(partner.id)}
                      className="w-full"
                    >
                      Connect
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Space Modal */}
      <CreateWellnessSpace 
        open={createSpaceOpen} 
        onOpenChange={setCreateSpaceOpen} 
        onCreated={handleSpaceCreated}
      />

      {/* Invite Friends Modal */}
      <InviteFriendsModal 
        open={inviteModalOpen} 
        onOpenChange={setInviteModalOpen}
        spaceName={selectedSpace || ""}
        spaceId={selectedSpaceId}
      />
    </Layout>
  );
};

export default Community;
