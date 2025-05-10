
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import { SendMessageModal } from "@/components/SendMessageModal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MessageData, MessageConversation, ConversationResult, MessageResult } from "@/types/message";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  MessageSquare, 
  User, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

const Messages = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [recipientName, setRecipientName] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
          const typedMessages = messageData.map((msg: MessageResult) => ({
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
              }) as {
                data: any;
                error: any;
              };
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
  
  const handleSendMessage = async () => {
    if (!user || !selectedConversation || !messageText.trim()) return;
    
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
      setMessageText("");
      
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
  
  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "p"); // Format as time (e.g., 3:30 PM)
    } catch (error) {
      return "";
    }
  };
  
  const formatConversationTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d");
    } catch (error) {
      return "";
    }
  };
  
  return (
    <Layout>
      <div className="container max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Messages</h1>
        
        <Card className="border rounded-lg overflow-hidden">
          <div className="grid md:grid-cols-[300px_1fr]">
            {/* Left sidebar - conversations list */}
            <div className="border-r">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Conversations</h2>
                <Button onClick={handleNewMessage} size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="overflow-auto h-[calc(80vh-9rem)]">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <MessageSquare className="mx-auto h-8 w-8 opacity-50" />
                    <p className="mt-2">No messages yet</p>
                    <Button 
                      onClick={handleNewMessage} 
                      variant="link" 
                      className="mt-1"
                    >
                      Start a conversation
                    </Button>
                  </div>
                ) : (
                  <div>
                    {conversations.map((conv) => (
                      <div 
                        key={conv.userId}
                        onClick={() => handleSelectConversation(conv.userId, conv.userName)}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedConversation === conv.userId ? "bg-muted" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://avatar.vercel.sh/${conv.userId}`} />
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium truncate">{conv.userName}</h3>
                              <span className="text-xs text-muted-foreground">
                                {formatConversationTime(conv.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage}
                            </p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <Badge variant="destructive" className="rounded-full px-[0.4rem] py-[0.15rem]">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right side - message content */}
            <div className="flex flex-col h-[80vh]">
              {selectedConversation ? (
                <>
                  <div className="border-b p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${selectedConversation}`} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{
                        conversations.find(c => c.userId === selectedConversation)?.userName || "Chat"
                      }</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        navigate(`/user/${selectedConversation}`);
                      }}
                    >
                      View Profile
                    </Button>
                  </div>
                  
                  {/* Messages container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div 
                          className={`max-w-[75%] rounded-lg p-3 ${
                            msg.sender_id === user?.id 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender_id === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}>
                            {formatMessageTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Write a message..." 
                        className="resize-none"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        className="h-full"
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-center p-8">
                  <div>
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/60" />
                    <h3 className="text-xl font-medium mt-4">Select a conversation</h3>
                    <p className="text-muted-foreground mt-1 max-w-sm">
                      Choose a conversation from the list or start a new one
                    </p>
                    <Button 
                      onClick={handleNewMessage} 
                      className="mt-4"
                    >
                      New Message
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
