
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageData, MessageResult } from "@/types/message";

export function useMessages(
  userId: string | undefined, 
  selectedConversation: string | null
) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedConversation || !userId) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      
      try {
        // Note: Using 'any' for RPC calls until Supabase types are updated
        const { data: messageData, error: messageError } = await supabase
          .rpc('get_conversation_messages', { 
            user1_id: userId, 
            user2_id: selectedConversation 
          } as any);
          
        if (messageError) throw messageError;
        
        if (messageData) {
          const typedMessages: MessageData[] = (messageData as any[]).map((msg: MessageResult) => ({
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
          if (typedMessages.some((msg: MessageData) => !msg.is_read && msg.recipient_id === userId)) {
            await supabase
              .rpc('mark_messages_as_read', {
                reader_id: userId,
                sender_id: selectedConversation
              } as any);
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
        recipient_id: userId,
        content: "Hi there! How are you doing today?",
        is_read: true,
        created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        updated_at: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "2",
        sender_id: userId,
        recipient_id: selectedConversation,
        content: "I'm doing great! Just finished my morning meditation.",
        is_read: true,
        created_at: new Date(Date.now() - 7000000).toISOString(),
        updated_at: new Date(Date.now() - 7000000).toISOString(),
      },
      {
        id: "3",
        sender_id: selectedConversation,
        recipient_id: userId,
        content: "That's awesome! How long have you been practicing meditation?",
        is_read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        updated_at: new Date(Date.now() - 3600000).toISOString(),
      }
    ];
    
    setMessages(mockMessages);
    // Uncomment when RPC function is available
    // fetchMessages();
  }, [selectedConversation, userId, toast]);

  const sendMessage = async (messageText: string, recipientId: string, senderId: string) => {
    try {
      if (!messageText.trim()) return;
      
      const newMessage = {
        sender_id: senderId,
        recipient_id: recipientId,
        content: messageText.trim(),
      };
      
      // Insert into messages table
      const { error } = await supabase
        .from('messages')
        .insert(newMessage);
        
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
      
      return sentMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive",
      });
      return null;
    }
  };

  return { messages, loading, sendMessage };
}
