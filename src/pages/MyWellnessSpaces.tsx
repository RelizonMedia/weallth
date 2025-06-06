
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Lock, Globe, Plus, Settings, UserPlus } from "lucide-react";
import CreateWellnessSpace from "@/components/CreateWellnessSpace";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WellnessSpaceData } from "@/types/message";
import InviteFriendsModal from "@/components/InviteFriendsModal";
import { Progress } from "@/components/ui/progress";

const MyWellnessSpaces = () => {
  const [activeTab, setActiveTab] = useState("joined");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [mySpaces, setMySpaces] = useState<WellnessSpaceData[]>([]);
  const [joinedSpaces, setJoinedSpaces] = useState<WellnessSpaceData[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [selectedSpaceName, setSelectedSpaceName] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    setLoadingSpaces(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to view your wellness spaces",
          variant: "destructive"
        });
        navigate("/auth");
        return;
      }

      // Load user created spaces from localStorage
      const savedCreatedSpaces = localStorage.getItem('userCreatedSpaces');
      let userCreatedSpaces: WellnessSpaceData[] = [];
      
      if (savedCreatedSpaces) {
        userCreatedSpaces = JSON.parse(savedCreatedSpaces);
      }
      
      // If no saved spaces, use mock data for created spaces
      const createdMockSpaces: WellnessSpaceData[] = [
        {
          id: 'space-1',
          name: 'Morning Runners Club',
          description: 'A group for early risers who enjoy starting their day with a run.',
          isPrivate: false,
          members: 15,
          createdAt: '2024-01-15',
          isCreator: true,
          mediaUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c',
          mediaType: 'image',
          ownerId: user.id
        },
        {
          id: 'space-2',
          name: 'Mindful Meditation Group',
          description: 'Daily meditation practices and discussions.',
          isPrivate: true,
          members: 8,
          createdAt: '2024-02-20',
          isCreator: true,
          mediaUrl: null,
          mediaType: 'none',
          ownerId: user.id
        }
      ];
      
      // Combine user-created spaces with mock data if there are no user spaces yet
      const combinedCreatedSpaces = userCreatedSpaces.length > 0 
        ? userCreatedSpaces 
        : createdMockSpaces;
      
      // Mock joined spaces
      const joinedMockSpaces: WellnessSpaceData[] = [
        {
          id: 'space-3',
          name: 'Healthy Meal Prep',
          description: 'Share recipes and meal prep ideas for a healthier lifestyle.',
          isPrivate: false,
          members: 42,
          createdAt: '2024-03-05',
          isCreator: false,
          mediaUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
          mediaType: 'image'
        },
        {
          id: 'space-4',
          name: 'Yoga Enthusiasts',
          description: 'For anyone who loves yoga and wants to share their journey.',
          isPrivate: false,
          members: 67,
          createdAt: '2023-12-10',
          isCreator: false,
          mediaUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
          mediaType: 'image'
        }
      ];
      
      setMySpaces(combinedCreatedSpaces);
      setJoinedSpaces(joinedMockSpaces);
    } catch (error) {
      console.error("Error fetching wellness spaces:", error);
      toast({
        title: "Failed to load spaces",
        description: "There was an error loading your wellness spaces.",
        variant: "destructive"
      });
    } finally {
      setLoadingSpaces(false);
    }
  };

  const handleCreateSpace = (spaceData: WellnessSpaceData) => {
    // Update the state with the new space
    setMySpaces(prev => [spaceData, ...prev]);
    
    // Automatically switch to the "created" tab to show the new space
    setActiveTab("created");
    
    toast({
      title: "Space Created",
      description: `Your wellness space "${spaceData.name}" has been created successfully.`
    });
  };

  const handleOpenSpace = (spaceId: string) => {
    // In a real app, this would navigate to the specific space
    navigate(`/community?spaceId=${spaceId}`);
  };

  const handleInviteFriends = (spaceId: string, spaceName: string) => {
    setSelectedSpaceId(spaceId);
    setSelectedSpaceName(spaceName);
    setInviteDialogOpen(true);
  };

  const handleManageSpace = (spaceId: string) => {
    toast({
      title: "Manage Space",
      description: "Space management options would appear here."
    });
  };

  const handleLeaveSpace = (spaceId: string) => {
    setJoinedSpaces(prev => prev.filter(space => space.id !== spaceId));
    
    toast({
      title: "Left Space",
      description: "You have successfully left this wellness space."
    });
  };

  return (
    <Layout>
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Wellness Spaces</h1>
            <p className="text-muted-foreground mt-1">
              Connect with others and grow together on your wellness journey
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Space</span>
          </Button>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="joined">Joined Spaces</TabsTrigger>
            <TabsTrigger value="created">My Created Spaces</TabsTrigger>
          </TabsList>
          
          {loadingSpaces ? (
            <div className="py-12">
              <p className="text-center text-muted-foreground mb-4">Loading your wellness spaces...</p>
              <Progress value={40} className="w-1/2 mx-auto" />
            </div>
          ) : (
            <>
              <TabsContent value="joined" className="mt-6">
                {joinedSpaces.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground/60" />
                    <h3 className="mt-4 text-lg font-medium">You haven't joined any wellness spaces yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Explore the community to find and join wellness spaces that match your interests.
                    </p>
                    <Button onClick={() => navigate('/community')} className="mt-4">
                      Explore Community
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {joinedSpaces.map(space => (
                      <Card key={space.id} className="overflow-hidden">
                        {space.mediaUrl && (
                          <div className="aspect-video w-full overflow-hidden">
                            {space.mediaType === 'image' && (
                              <img 
                                src={space.mediaUrl} 
                                alt={space.name} 
                                className="h-full w-full object-cover transition-all hover:scale-105"
                              />
                            )}
                            {space.mediaType === 'video' && (
                              <video 
                                src={space.mediaUrl}
                                className="h-full w-full object-cover"
                                controls
                              />
                            )}
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="line-clamp-1">{space.name}</CardTitle>
                            {space.isPrivate ? (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <CardDescription className="line-clamp-2">
                            {space.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {space.members} {space.members === 1 ? 'member' : 'members'} • Joined {new Date(space.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2">
                          <Button 
                            variant="default" 
                            className="flex-1"
                            onClick={() => handleOpenSpace(space.id)}
                          >
                            Open
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleLeaveSpace(space.id)}
                            title="Leave space"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="created" className="mt-6">
                {mySpaces.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground/60" />
                    <h3 className="mt-4 text-lg font-medium">You haven't created any wellness spaces yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Create your first wellness space to connect with others who share your wellness goals.
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4">
                      Create Your First Space
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {mySpaces.map(space => (
                      <Card key={space.id} className="overflow-hidden">
                        {space.mediaUrl && (
                          <div className="aspect-video w-full overflow-hidden">
                            {space.mediaType === 'image' && (
                              <img 
                                src={space.mediaUrl} 
                                alt={space.name} 
                                className="h-full w-full object-cover transition-all hover:scale-105"
                              />
                            )}
                            {space.mediaType === 'video' && (
                              <video 
                                src={space.mediaUrl}
                                className="h-full w-full object-cover"
                                controls
                              />
                            )}
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="line-clamp-1">{space.name}</CardTitle>
                            {space.isPrivate ? (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <CardDescription className="line-clamp-2">
                            {space.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {space.members} {space.members === 1 ? 'member' : 'members'} • Created {new Date(space.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2">
                          <Button 
                            variant="default" 
                            onClick={() => handleOpenSpace(space.id)}
                          >
                            Open
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleInviteFriends(space.id, space.name)}
                            title="Invite friends"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleManageSpace(space.id)}
                            title="Manage space"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      
      <CreateWellnessSpace 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onCreated={handleCreateSpace} 
      />

      <InviteFriendsModal 
        open={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen} 
        spaceName={selectedSpaceName}
        spaceId={selectedSpaceId}
      />
    </Layout>
  );
};

export default MyWellnessSpaces;
