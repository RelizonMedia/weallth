
import { useState } from "react";
import { MessageConversation } from "@/types/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface ConversationListProps {
  conversations: MessageConversation[];
  selectedConversation: string | null;
  onSelectConversation: (userId: string, userName: string) => void;
  onNewMessage: () => void;
}

export const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onNewMessage
}: ConversationListProps) => {
  const formatConversationTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d");
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Conversations</h2>
        <Button onClick={onNewMessage} size="sm" variant="outline" className="h-8 w-8 p-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="overflow-auto h-[calc(80vh-9rem)]">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-8 w-8 opacity-50" />
            <p className="mt-2">No messages yet</p>
            <Button 
              onClick={onNewMessage} 
              variant="link" 
              className="mt-1"
            >
              Start a conversation
            </Button>
          </div>
        ) : (
          <div>
            {conversations.map((conv) => (
              <div 
                key={conv.userId}
                onClick={() => onSelectConversation(conv.userId, conv.userName)}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation === conv.userId ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${conv.userId}`} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{conv.userName}</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatConversationTime(conv.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge variant="destructive" className="rounded-full px-[0.4rem] py-[0.15rem]">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
