
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { MessageData } from "@/types/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Send } from "lucide-react";

interface MessageContentProps {
  selectedConversation: string | null;
  recipientName: string;
  messages: MessageData[];
  onSendMessage: (text: string) => void;
  currentUserId: string;
}

export const MessageContent = ({
  selectedConversation,
  recipientName,
  messages,
  onSendMessage,
  currentUserId
}: MessageContentProps) => {
  const [messageText, setMessageText] = useState("");
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    onSendMessage(messageText);
    setMessageText("");
  };
  
  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "p"); // Format as time (e.g., 3:30 PM)
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://avatar.vercel.sh/${selectedConversation}`} />
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
            navigate(`/user/${selectedConversation}`);
          }}
        >
          View Profile
        </Button>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg p-3 ${
                msg.sender_id === currentUserId 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              }`}
            >
              <p>{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.sender_id === currentUserId ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}>
                {formatMessageTime(msg.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Message input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea 
            placeholder="Write a message..." 
            className="resize-none"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            className="h-full"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageContent;
