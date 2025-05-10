
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageData } from "@/types/message";
import { useToast } from "@/hooks/use-toast";
import MessageContent from "@/components/messaging/MessageContent";
import EmptyConversation from "@/components/messaging/EmptyConversation";

interface MessagePanelProps {
  selectedConversation: string | null;
  recipientName: string;
  messages: MessageData[];
  onSendMessage: (text: string) => void;
  onNewMessage: () => void;
}

export const MessagePanel = ({
  selectedConversation,
  recipientName,
  messages,
  onSendMessage,
  onNewMessage,
}: MessagePanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    try {
      onSendMessage(text);
    } catch (error) {
      console.error("Error in MessagePanel:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return selectedConversation ? (
    <MessageContent
      selectedConversation={selectedConversation}
      recipientName={recipientName}
      messages={messages}
      onSendMessage={handleSendMessage}
      currentUserId={user?.id || ""}
    />
  ) : (
    <EmptyConversation onNewMessage={onNewMessage} />
  );
};

export default MessagePanel;
