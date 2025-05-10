
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface ProfileData {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface MessageData {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  is_read: boolean;
  sender?: ProfileData;
  recipient?: ProfileData;
}

interface ConversationPartner {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationPartner[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [partner, setPartner] = useState<ProfileData | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        setLoading(true);
        
        // Get all sent and received messages
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            sender_id,
            recipient_id,
            is_read,
            sender:profiles!sender_id(id, username, full_name, avatar_url),
            recipient:profiles!recipient_id(id, username, full_name, avatar_url)
          `)
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Process messages into conversations
        const conversationsMap = new Map<string, ConversationPartner>();
        
        data.forEach((msg: any) => {
          // Determine the conversation partner (the other person)
          const isUserSender = msg.sender_id === user.id;
          const partnerId = isUserSender ? msg.recipient_id : msg.sender_id;
          const partnerProfile = isUserSender ? msg.recipient : msg.sender;
          
          if (!partnerProfile) return;
          
          const existingConversation = conversationsMap.get(partnerId);
          
          // Count unread messages from this partner
          const isUnread = !msg.is_read && !isUserSender;
          
          if (existingConversation) {
            // If this message is more recent than the last one we have, update the last message
            if (!existingConversation.last_message_time || 
                new Date(msg.created_at) > new Date(existingConversation.last_message_time)) {
              existingConversation.last_message = msg.content;
              existingConversation.last_message_time = msg.created_at;
            }
            
            if (isUnread) {
              existingConversation.unread_count += 1;
            }
          } else {
            // Create a new conversation entry
            conversationsMap.set(partnerId, {
              id: partnerId,
              username: partnerProfile.username,
              full_name: partnerProfile.full_name,
              avatar_url: partnerProfile.avatar_url,
              last_message: msg.content,
              last_message_time: msg.created_at,
              unread_count: isUnread ? 1 : 0
            });
          }
        });
        
        // Convert map to array and sort by last message time
        const conversationsList = Array.from(conversationsMap.values())
          .sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime());
        
        setConversations(conversationsList);
        
        // If we have conversations, select the first one
        if (conversationsList.length > 0) {
          setSelectedConversation(conversationsList[0].id);
          loadMessages(conversationsList[0].id);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Failed to load messages",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user, toast]);

  const loadMessages = async (partnerId: string) => {
    if (!user) return;
    
    try {
      // Get partner profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', partnerId)
        .single();
      
      if (profileError) throw profileError;
      
      setPartner(profileData);
      
      // Get messages between current user and partner
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          recipient_id,
          is_read
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (messagesError) throw messagesError;
      
      setMessages(messagesData);
      
      // Mark messages as read
      const unreadMessageIds = messagesData
        .filter((msg: MessageData) => msg.recipient_id === user.id && !msg.is_read)
        .map((msg: MessageData) => msg.id);
      
      if (unreadMessageIds.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessageIds);
        
        // Update the unread count in conversations
        setConversations(prev => prev.map(conv => 
          conv.id === partnerId ? { ...conv, unread_count: 0 } : conv
        ));
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast({
        title: "Failed to load conversation",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSelectConversation = (partnerId: string) => {
    setSelectedConversation(partnerId);
    loadMessages(partnerId);
  };

  const handleSendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;
    
    try {
      setSendingMessage(true);
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedConversation,
          content: newMessage.trim()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new message to the messages list
      setMessages(prev => [...prev, data]);
      
      // Update the conversation list
      setConversations(prev => {
        const updatedConversations = prev.map(conv => {
          if (conv.id === selectedConversation) {
            return {
              ...conv,
              last_message: newMessage.trim(),
              last_message_time: new Date().toISOString()
            };
          }
          return conv;
        });
        
        // Sort conversations by last message time
        return updatedConversations.sort((a, b) => 
          new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime()
        );
      });
      
      // Clear the input
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations list */}
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-240px)]">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto h-[calc(100%-60px)]">
                {loading ? (
                  <div className="space-y-2 px-4 py-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[120px]" />
                          <Skeleton className="h-3 w-[180px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <p>No conversations yet</p>
                    <p className="text-sm mt-2">
                      Visit the <Link to="/community" className="text-primary hover:underline">community</Link> to connect with others
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {conversations.map((conv) => (
                      <div 
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className={`flex items-center p-4 cursor-pointer hover:bg-muted/40 ${selectedConversation === conv.id ? 'bg-muted' : ''}`}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conv.avatar_url || undefined} />
                            <AvatarFallback>
                              {conv.username?.[0]?.toUpperCase() || conv.full_name?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          {conv.unread_count > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                        
                        <div className="ml-4 flex-1 overflow-hidden">
                          <p className="font-medium truncate">
                            {conv.full_name || conv.username || 'User'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.last_message}
                          </p>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conv.last_message_time), { addSuffix: true })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Message content */}
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-240px)] flex flex-col">
              {selectedConversation && partner ? (
                <>
                  <CardHeader className="border-b py-3">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={partner.avatar_url || undefined} />
                        <AvatarFallback>
                          {partner.username?.[0]?.toUpperCase() || partner.full_name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link to={`/user/${partner.id}`} className="font-medium hover:underline">
                          {partner.full_name || partner.username || 'User'}
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground mt-8">
                        <p>No messages yet</p>
                        <p className="text-sm mt-1">Start the conversation by sending a message</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isUserMessage = message.sender_id === user?.id;
                        return (
                          <div 
                            key={message.id}
                            className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`rounded-lg p-3 max-w-[75%] ${
                                isUserMessage 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${isUserMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Type a message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="resize-none"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={sendingMessage || !newMessage.trim()}
                        className="flex-shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-6">
                  <div>
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                    <p className="text-muted-foreground mb-4">
                      Select a conversation from the list or visit the community to connect with others
                    </p>
                    <Button asChild>
                      <Link to="/community">Go to Community</Link>
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
