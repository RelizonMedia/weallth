
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateWellnessSpace from "@/components/CreateWellnessSpace";
import { Plus } from "lucide-react";
import { WellnessSpaceData } from "@/types/message";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const MyWellnessSpaces = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-spaces");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // This would typically come from an API or database
  const mySpaces: WellnessSpaceData[] = [
    {
      id: "ws-1",
      name: "Mental Wellness Community",
      description: "A safe space to discuss mental health challenges and share coping strategies.",
      isPrivate: false,
      members: 156,
      createdAt: "2023-11-15T10:00:00Z",
      isCreator: true,
      mediaUrl: "/images/mental-wellness.jpg",
      mediaType: "image",
      ownerId: user?.id || "",
      allowInvites: true
    },
    {
      id: "ws-2",
      name: "Meditation Masters",
      description: "Daily meditation sessions and mindfulness practices.",
      isPrivate: true,
      members: 42,
      createdAt: "2023-12-01T14:30:00Z",
      isCreator: true,
      mediaUrl: null,
      mediaType: "none",
      ownerId: user?.id || "",
      allowInvites: true
    }
  ];

  const joinedSpaces: WellnessSpaceData[] = [
    {
      id: "ws-3",
      name: "Fitness Journey",
      description: "Share your fitness goals, progress, and motivate each other.",
      isPrivate: false,
      members: 215,
      createdAt: "2023-10-05T09:15:00Z",
      isCreator: false,
      mediaUrl: "/images/fitness.jpg",
      mediaType: "image",
      ownerId: "user-123",
      allowInvites: true
    },
    {
      id: "ws-4",
      name: "Healthy Recipes",
      description: "Exchange nutritious and delicious recipes for a healthier lifestyle.",
      isPrivate: false,
      members: 189,
      createdAt: "2023-09-18T16:45:00Z",
      isCreator: false,
      mediaUrl: "/images/recipes.jpg",
      mediaType: "image",
      ownerId: "user-456",
      allowInvites: true
    }
  ];

  // Placeholder for API functionality
  const handleCreateSpace = (data: any) => {
    console.log("Creating new space:", data);
    setShowCreateModal(false);
    // Here you would typically send data to your API and then refresh the list
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Wellness Spaces</h1>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Space
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="my-spaces">Spaces I Created</TabsTrigger>
            <TabsTrigger value="joined-spaces">Spaces I Joined</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-spaces" className="space-y-6">
            {mySpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySpaces.map((space) => (
                  <SpaceCard key={space.id} space={space} isCreator={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't created any wellness spaces yet.</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Space
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="joined-spaces" className="space-y-6">
            {joinedSpaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedSpaces.map((space) => (
                  <SpaceCard key={space.id} space={space} isCreator={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">You haven't joined any wellness spaces yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {showCreateModal && (
          <CreateWellnessSpace 
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateSpace}
          />
        )}
      </div>
    </Layout>
  );
};

interface SpaceCardProps {
  space: WellnessSpaceData;
  isCreator: boolean;
}

const SpaceCard = ({ space, isCreator }: SpaceCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
      {space.mediaUrl && (
        <div className="w-full h-48 relative">
          <AspectRatio ratio={16 / 9}>
            <img 
              src={space.mediaUrl} 
              alt={space.name}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-xl">{space.name}</h3>
          {space.isPrivate && (
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
              Private
            </span>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {space.description}
        </p>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{space.members} members</span>
          {isCreator ? (
            <Button variant="outline" size="sm">
              Manage
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              View
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyWellnessSpaces;
