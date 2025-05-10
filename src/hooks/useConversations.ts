
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageConversation, ConversationResult } from "@/types/message";

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    
    const fetchConversations = async () => {
      setLoading(true);
      
      try {
        // Using type assertion for the RPC function call
        const { data: sentMessages, error: sentError } = await supabase
          .rpc('get_user_conversations', { 
            user_id: userId 
          }) as unknown as { 
            data: ConversationResult[], 
            error: any 
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
    
    // For demo purposes - using mock data until RPC function is available
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
  }, [userId, toast]);

  return { conversations, loading, setConversations };
}
