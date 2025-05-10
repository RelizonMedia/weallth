
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/message";
import { useAuth } from "@/contexts/AuthContext";

export const useConversations = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const { 
    data: conversations = [], 
    isLoading: conversationsLoading 
  } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Note: This is a mock implementation until conversations table is created
      // Once the actual table is created, this should be updated
      const mockConversations: Conversation[] = [
        {
          id: '1',
          title: 'My first conversation',
          user_id: user.id,
          last_message: 'Hello there!',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockConversations;
    },
    enabled: !!user
  });

  return {
    conversations,
    selectedConversation,
    setSelectedConversation,
    conversationsLoading
  };
};
