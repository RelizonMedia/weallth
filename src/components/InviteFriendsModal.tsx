
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, User, Mail, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InviteFriendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceName: string;
  spaceId: string | null;
}

type FriendData = {
  id: number;
  userId: string;
  name: string;
  email: string;
  invited: boolean;
};

// Mock friends data
const mockFriends = [
  { id: 1, userId: "user-1", name: "Taylor Wilson", email: "taylor@example.com", invited: false },
  { id: 2, userId: "user-2", name: "Jordan Lee", email: "jordan@example.com", invited: false },
  { id: 3, userId: "user-3", name: "Casey Morgan", email: "casey@example.com", invited: false },
  { id: 4, userId: "user-4", name: "Alex Rivera", email: "alex@example.com", invited: false },
];

const InviteFriendsModal = ({ open, onOpenChange, spaceName, spaceId }: InviteFriendsModalProps) => {
  const [friends, setFriends] = useState<FriendData[]>(mockFriends);
  const [emailInput, setEmailInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && spaceId) {
      fetchFriends();
    }
  }, [open, spaceId]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // In a real implementation, you would fetch friends from Supabase
      // For now we'll use mock data
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reset invitation status when modal opens
      setFriends(mockFriends.map(friend => ({ ...friend, invited: false })));
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (userId: string, id: number) => {
    if (!spaceId) return;
    
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, invited: true } : friend
    ));
    
    try {
      // In a real implementation, you would save the invitation to Supabase
      // await supabase.from('space_invitations').insert({
      //   space_id: spaceId,
      //   user_id: userId,
      //   status: 'pending'
      // });
      
      toast({
        title: "Invitation sent!",
        description: "Your friend has been invited to the wellness space.",
      });
    } catch (error) {
      console.error("Error sending invitation:", error);
      
      // Revert the UI state if there's an error
      setFriends(friends.map(friend => 
        friend.id === id ? { ...friend, invited: false } : friend
      ));
      
      toast({
        title: "Failed to send invitation",
        description: "There was an error sending the invitation.",
        variant: "destructive"
      });
    }
  };

  const handleEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailInput.includes('@') || !emailInput.includes('.')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!spaceId) return;
    
    try {
      // In a real implementation, you would save the email invitation to Supabase
      // await supabase.from('space_email_invitations').insert({
      //   space_id: spaceId,
      //   email: emailInput,
      //   status: 'pending'
      // });
      
      toast({
        title: "Invitation sent!",
        description: `An invitation has been sent to ${emailInput}`,
      });
      
      setEmailInput("");
    } catch (error) {
      console.error("Error sending email invitation:", error);
      
      toast({
        title: "Failed to send invitation",
        description: "There was an error sending the email invitation.",
        variant: "destructive"
      });
    }
  };

  const copyInviteLink = () => {
    if (!spaceId) return;
    
    // Generate an invite link with the space ID
    const inviteLink = `${window.location.origin}/join-space?id=${spaceId}`;
    
    navigator.clipboard.writeText(inviteLink);
    
    toast({
      title: "Link copied!",
      description: "The invite link has been copied to your clipboard."
    });
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Friends to "{spaceName}"</DialogTitle>
          <DialogDescription>
            Invite friends to join your wellness space. They'll receive a notification to join.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Search friends */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Friends list */}
          <div className="border rounded-md">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading your friends...
              </div>
            ) : filteredFriends.length > 0 ? (
              <div className="divide-y">
                {filteredFriends.map((friend) => (
                  <div key={friend.id} className="p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{friend.name}</p>
                        <p className="text-sm text-muted-foreground">{friend.email}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={friend.invited ? "outline" : "default"}
                      onClick={() => handleInvite(friend.userId, friend.id)}
                      disabled={friend.invited}
                    >
                      {friend.invited ? "Invited" : "Invite"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No friends found matching "{searchQuery}"
              </div>
            )}
          </div>
          
          {/* Invite by email */}
          <div className="space-y-2">
            <Label htmlFor="email-invite">Or invite by email</Label>
            <form onSubmit={handleEmailInvite} className="flex space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email-invite"
                  placeholder="friend@example.com"
                  type="email"
                  className="pl-8"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
              <Button type="submit">
                <Mail className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
          
          {/* Share link */}
          <div className="mt-4 bg-secondary/50 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Share className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Or share an invite link</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyInviteLink}
              >
                Copy Link
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteFriendsModal;
