
import { useState } from "react";
import Layout from "@/components/Layout";
import { SendMessageModal } from "@/components/SendMessageModal";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import ConversationList from "@/components/messaging/ConversationList";
import MessagePanel from "@/components/messaging/MessagePanel";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  
  const { user } = useAuth();
  const { conversations, setConversations } = useConversations(user?.id);
  const { messages, sendMessage } = useMessages(user?.id, selectedConversation);
  
  const handleSendMessage = async (messageText: string) => {
    if (!user || !selectedConversation) return;
    
    const sentMessage = await sendMessage(messageText, selectedConversation, user.id);
    if (!sentMessage) return;
    
    // Update the conversation list with the new message
    const updatedConversations = conversations.map(conv => {
      if (conv.userId === selectedConversation) {
        return {
          ...conv,
          lastMessage: messageText.trim(),
          timestamp: new Date().toISOString(),
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
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
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
              onNewMessage={handleNewMessage}
            />
            
            {/* Right side - message content */}
            <MessagePanel
              selectedConversation={selectedConversation}
              recipientName={recipientName}
              messages={messages}
              onSendMessage={handleSendMessage}
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
