
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
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error("Failed to fetch messages:", error);
        throw new Error(error.message);
      }
      
      return data as Message[];
    },
    enabled: !!conversationId
  });

  // Send a message
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) throw new Error("No conversation selected");
      
      const newMessage = {
        conversation_id: conversationId,
        content,
        is_from_user: true,
        created_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the conversation's last message and updated_at
      await supabase
        .from('conversations')
        .update({
          last_message: content,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);
      
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] as unknown as never });
      queryClient.invalidateQueries({ queryKey: ['conversations'] as unknown as never });
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
