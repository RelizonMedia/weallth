
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import ConversationList from "@/components/messaging/ConversationList";
import MessageContent from "@/components/messaging/MessageContent";
import EmptyConversation from "@/components/messaging/EmptyConversation";
import { MessageData, MessageConversation } from "@/types/message";

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      try {
        setLoading(true);
        if (!user) return;

        const { data, error } = await supabase
          .rpc('get_conversations', { user_id: user.id });
        
        if (error) throw error;

        // Transform data into required format
        const formattedConversations: MessageConversation[] = data.map((conv: any) => ({
          userId: conv.other_user_id,
          userName: conv.other_user_name || 'Unknown User',
          lastMessage: conv.last_message || 'No messages yet',
          timestamp: conv.last_message_time || new Date().toISOString(),
          unreadCount: conv.unread_count || 0,
        }));
        
        setConversations(formattedConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast({
          title: "Error loading messages",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
    // Set up real-time subscription for new messages
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `recipient_id=eq.${user?.id}`
      }, () => {
        loadConversations();
        // If conversation is selected, refresh messages
        if (selectedUser) {
          loadMessages(selectedUser.id);
        }
      })
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [user, toast, selectedUser]);

  // Load messages for a specific conversation
  const loadMessages = async (otherUserId: string) => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .rpc('get_messages_between_users', { 
          user1_id: user.id,
          user2_id: otherUserId
        });
      
      if (error) throw error;

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('sender_id', otherUserId);

      // Update conversations to reflect read messages
      setConversations(prev => 
        prev.map(conv => 
          conv.userId === otherUserId 
            ? { ...conv, unreadCount: 0 } 
            : conv
        )
      );

      // Format messages
      const formattedMessages: MessageData[] = data.map((msg: any) => ({
        id: msg.id,
        sender_id: msg.sender_id,
        recipient_id: msg.recipient_id,
        content: msg.content,
        is_read: msg.is_read,
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        senderName: msg.sender_name
      }));
      
      setMessages(formattedMessages);
      
      // Scroll to bottom after messages load
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error loading messages",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSelectConversation = (conversation: MessageConversation) => {
    setSelectedUser({
      id: conversation.userId,
      name: conversation.userName
    });
    loadMessages(conversation.userId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user || !selectedUser) return;
    
    try {
      setSending(true);
      
      const newMessage = {
        sender_id: user.id,
        recipient_id: selectedUser.id,
        content: message.trim(),
      };
      
      const { error } = await supabase
        .from('messages')
        .insert([newMessage]);
        
      if (error) throw error;
      
      // Optimistically update UI
      const optimisticMessage: MessageData = {
        id: Date.now().toString(),
        sender_id: user.id,
        recipient_id: selectedUser.id,
        content: message,
        is_read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        senderName: 'You'
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setMessage("");
      
      // Update the conversation list
      const updatedConversations = conversations.map(conv => {
        if (conv.userId === selectedUser.id) {
          return {
            ...conv,
            lastMessage: message,
            timestamp: new Date().toISOString()
          };
        }
        return conv;
      });
      
      setConversations(updatedConversations);
      
      // Reload messages to get the proper ID and timestamp
      setTimeout(() => {
        loadMessages(selectedUser.id);
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Conversations sidebar */}
        <div className="w-1/3 border-r bg-muted/30">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-116px)]">
            <ConversationList 
              conversations={conversations}
              selectedUserId={selectedUser?.id}
              onSelectConversation={handleSelectConversation}
              loading={loading}
            />
          </div>
        </div>

        {/* Message content area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-semibold">{selectedUser.name}</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 184px)' }}>
                <MessageContent 
                  messages={messages}
                  currentUserId={user?.id || ''}
                />
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending}
                  className="flex-1"
                />
                <Button type="submit" disabled={!message.trim() || sending}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <EmptyConversation />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
