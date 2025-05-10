
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageCircle, Trophy, PartyPopper, Search, Users, Plus, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    type: "progress"
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
    type: "win"
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
  const { toast } = useToast();

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
    setPostContent("");
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

  const handleCreateCommunity = () => {
    toast({
      title: "Coming soon!",
      description: "This feature will be available soon",
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
                  <CardContent>
                    <p>{post.content}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <Star className="mr-1 h-4 w-4" />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center">
                        <MessageCircle className="mr-1 h-4 w-4" />
                        <span>{post.comments}</span>
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCelebration(post.id)}
                      className="flex items-center"
                    >
                      <PartyPopper className="mr-1 h-4 w-4 text-purple-500" />
                      Celebrate ({post.celebrations})
                    </Button>
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
                  placeholder="Search communities..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateCommunity}>
                <Plus className="h-4 w-4 mr-2" /> Create Space
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCommunities.map((community) => (
                <Card key={community.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center">
                        {community.name}
                        {community.isPrivate && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
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
    </Layout>
  );
};

export default Community;
