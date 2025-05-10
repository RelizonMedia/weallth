
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { SendMessageModal } from "@/components/SendMessageModal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MessageData, MessageConversation, ConversationResult, MessageResult } from "@/types/message";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import ConversationList from "@/components/messaging/ConversationList";
import MessageContent from "@/components/messaging/MessageContent";
import EmptyConversation from "@/components/messaging/EmptyConversation";

const Messages = () => {
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchConversations = async () => {
      setLoading(true);
      
      try {
        // Using a direct query approach with raw SQL results
        const { data: sentMessages, error: sentError } = await supabase
          .rpc('get_user_conversations', { user_id: user.id }) as { 
            data: ConversationResult[] | null; 
            error: any;
          };
          
        if (sentError) throw sentError;
        
        // Process the conversations
        const processedConversations = (sentMessages || []).map((conv: ConversationResult) => ({
          userId: conv.other_user_id,
          userName: conv.other_user_name || 'Unknown User',
          lastMessage: conv.last_message || '',
          timestamp: conv.last_message_time || '',
          unreadCount: conv.unread_count || 0,
        }));
        
        setConversations(processedConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast({
          title: "Error loading conversations",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    // Mock data for now since we don't have the RPC function yet
    const mockConversations: MessageConversation[] = [
      {
        userId: "1",
        userName: "Taylor Wilson",
        lastMessage: "Thanks for your message!",
        timestamp: new Date().toISOString(),
        unreadCount: 2
      },
      {
        userId: "2",
        userName: "Jordan Lee",
        lastMessage: "Let's chat about our wellness goals",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        unreadCount: 0
      }
    ];
    
    setConversations(mockConversations);
    // Uncomment when RPC function is available
    // fetchConversations();
  }, [user]);
  
  useEffect(() => {
    if (!selectedConversation || !user) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      
      try {
        // Using the raw query approach
        const { data: messageData, error: messageError } = await supabase
          .rpc('get_conversation_messages', { 
            user1_id: user.id, 
            user2_id: selectedConversation 
          }) as {
            data: MessageResult[] | null;
            error: any;
          };
          
        if (messageError) throw messageError;
        
        if (messageData) {
          const typedMessages: MessageData[] = messageData.map((msg: MessageResult) => ({
            id: msg.id,
            sender_id: msg.sender_id,
            recipient_id: msg.recipient_id,
            content: msg.content,
            is_read: msg.is_read,
            created_at: msg.created_at,
            updated_at: msg.updated_at,
            senderName: msg.sender_name || 'Unknown',
          }));
          
          setMessages(typedMessages);
          
          // Mark messages as read
          if (typedMessages.some((msg: MessageData) => !msg.is_read && msg.recipient_id === user.id)) {
            await supabase
              .rpc('mark_messages_as_read', {
                reader_id: user.id,
                sender_id: selectedConversation
              });
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error loading messages",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    // Mock data for now
    const mockMessages: MessageData[] = [
      {
        id: "1",
        sender_id: selectedConversation,
        recipient_id: user.id,
        content: "Hi there! How are you doing today?",
        is_read: true,
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        updated_at: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "2",
        sender_id: user.id,
        recipient_id: selectedConversation,
        content: "I'm doing great! Just finished my morning meditation.",
        is_read: true,
        created_at: new Date(Date.now() - 7000000).toISOString(),
        updated_at: new Date(Date.now() - 7000000).toISOString(),
      },
      {
        id: "3",
        sender_id: selectedConversation,
        recipient_id: user.id,
        content: "That's awesome! How long have you been practicing meditation?",
        is_read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        updated_at: new Date(Date.now() - 3600000).toISOString(),
      }
    ];
    
    setMessages(mockMessages);
    // Uncomment when RPC function is available
    // fetchMessages();
  }, [selectedConversation, user]);
  
  const handleSendMessage = async (messageText: string) => {
    if (!user || !selectedConversation) return;
    
    try {
      const newMessage = {
        sender_id: user.id,
        recipient_id: selectedConversation,
        content: messageText.trim(),
      };
      
      // Using type assertion to bypass TypeScript checking
      const { error } = await supabase
        .from('messages')
        .insert(newMessage as any);
        
      if (error) throw error;
      
      // Optimistically update UI
      const sentMessage: MessageData = {
        ...newMessage,
        id: Date.now().toString(), // Temporary ID
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setMessages([...messages, sentMessage]);
      
      // Update the conversation list
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
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
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
            {selectedConversation ? (
              <MessageContent
                selectedConversation={selectedConversation}
                recipientName={recipientName}
                messages={messages}
                onSendMessage={handleSendMessage}
                currentUserId={user?.id || ""}
              />
            ) : (
              <EmptyConversation onNewMessage={handleNewMessage} />
            )}
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
