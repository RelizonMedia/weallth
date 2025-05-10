
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message";

export const useMessages = (conversationId: string | null) => {
  const [messageText, setMessageText] = useState("");
  const queryClient = useQueryClient();

  // Fetch messages for the selected conversation
  const { 
    data: messages = [],
    isLoading: messagesLoading,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      
      // Note: This is a mock implementation until messages table is updated
      // with conversation_id and is_from_user fields
      const mockMessages: Message[] = [
        {
          id: '1',
          conversation_id: conversationId,
          content: 'How are you doing today?',
          is_from_user: false,
          created_at: new Date().toISOString()
        }
      ];
      
      return mockMessages;
    },
    enabled: !!conversationId
  });

  // Send a message
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) throw new Error("No conversation selected");
      
      // Mock sending a message for now
      // This should be updated when the messages table is properly created
      const newMessage: Message = {
        id: Date.now().toString(),
        conversation_id: conversationId,
        content,
        is_from_user: true,
        created_at: new Date().toISOString(),
      };
      
      return newMessage;
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId]});
      queryClient.invalidateQueries({ queryKey: ['conversations']});
      setMessageText("");
    }
  });

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    try {
      await sendMessage.mutateAsync(messageText);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return {
    messages,
    messagesLoading,
    messageText,
    setMessageText,
    handleSendMessage,
    refetchMessages
  };
};
