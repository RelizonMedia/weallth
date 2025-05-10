
import { useState } from "react";
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
import { Search, User, UserPlus, Mail, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InviteFriendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceName: string;
}

// Mock friends data
const mockFriends = [
  { id: 1, name: "Taylor Wilson", email: "taylor@example.com", invited: false },
  { id: 2, name: "Jordan Lee", email: "jordan@example.com", invited: false },
  { id: 3, name: "Casey Morgan", email: "casey@example.com", invited: false },
  { id: 4, name: "Alex Rivera", email: "alex@example.com", invited: false },
];

const InviteFriendsModal = ({ open, onOpenChange, spaceName }: InviteFriendsModalProps) => {
  const [friends, setFriends] = useState(mockFriends);
  const [emailInput, setEmailInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleInvite = (id: number) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, invited: true } : friend
    ));
    
    toast({
      title: "Invitation sent!",
      description: "Your friend has been invited to the wellness space.",
    });
  };

  const handleEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailInput.includes('@') || !emailInput.includes('.')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Invitation sent!",
      description: `An invitation has been sent to ${emailInput}`,
    });
    
    setEmailInput("");
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            {filteredFriends.length > 0 ? (
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
                      onClick={() => handleInvite(friend.id)}
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
              <Button variant="outline" size="sm" onClick={() => {
                toast({
                  title: "Link copied!",
                  description: "The invite link has been copied to your clipboard."
                })
              }}>
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
