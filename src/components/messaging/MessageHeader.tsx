
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface MessageHeaderProps {
  recipientId: string | null;
  recipientName: string;
}

export const MessageHeader = ({ recipientId, recipientName }: MessageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={`https://avatar.vercel.sh/${recipientId}`} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold">{recipientName}</h3>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => {
          if (recipientId) {
            navigate(`/user/${recipientId}`);
          }
        }}
      >
        View Profile
      </Button>
    </div>
  );
};

export default MessageHeader;
