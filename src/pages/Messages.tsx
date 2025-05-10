
import { useState } from "react";
import Layout from "@/components/Layout";
import { SendMessageModal } from "@/components/SendMessageModal";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import ConversationList from "@/components/messaging/ConversationList";
import MessagePanel from "@/components/messaging/MessagePanel";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { MessageConversation, MessageData, Message } from "@/types/message";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  
  const { user } = useAuth();
  const { conversations, conversationsLoading } = useConversations();
  const { messages, messageText, setMessageText, handleSendMessage } = useMessages(selectedConversation);
  
  // Convert Conversation[] to MessageConversation[]
  const formattedConversations: MessageConversation[] = conversations.map(conv => ({
    userId: conv.user_id,
    userName: conv.title || "Unknown",
    lastMessage: conv.last_message || "",
    timestamp: conv.updated_at || conv.created_at,
    unreadCount: 0, // Default to 0 for now
  }));
  
  // Convert Message[] to MessageData[]
  const formattedMessages: MessageData[] = messages.map(msg => ({
    id: msg.id,
    sender_id: msg.is_from_user ? (user?.id || '') : selectedConversation || '',
    recipient_id: msg.is_from_user ? (selectedConversation || '') : (user?.id || ''),
    content: msg.content,
    is_read: true, // Assume read for simplicity
    created_at: msg.created_at,
    updated_at: msg.updated_at || msg.created_at,
    senderName: msg.is_from_user ? 'You' : recipientName
  }));
  
  // Handle sending message
  const handleSendMessageWrapper = (messageText: string) => {
    if (!messageText.trim() || !selectedConversation) return;
    handleSendMessage();
  };
  
  const handleNewMessage = () => {
    setSendModalOpen(true);
  };
  
  const handleSelectConversation = (userId: string, userName: string) => {
    setSelectedConversation(userId);
    setRecipientName(userName);
  };
  
  return (
    <Layout>
      <div className="container max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Messages</h1>
        
        <Card className="border rounded-lg overflow-hidden">
          <div className="grid md:grid-cols-[300px_1fr]">
            {/* Left sidebar - conversations list */}
            <ConversationList 
              conversations={formattedConversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
              onNewMessage={handleNewMessage}
            />
            
            {/* Right side - message content */}
            <MessagePanel
              selectedConversation={selectedConversation}
              recipientName={recipientName}
              messages={formattedMessages} 
              onSendMessage={handleSendMessageWrapper}
              onNewMessage={handleNewMessage}
            />
          </div>
        </Card>
      </div>
      
      <SendMessageModal
        open={sendModalOpen}
        onOpenChange={setSendModalOpen}
        recipientId={recipientId}
        recipientName={recipientName}
      />
    </Layout>
  );
};

export default Messages;
