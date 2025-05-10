import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Brain, Sparkles, Info, LifeBuoy, ThumbsUp } from "lucide-react";
import AIMessage from "@/components/AIMessage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

// Define message types
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  expertType?: string;
}

// Define expert types
interface Expert {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  specialty: string;
}
const experts: Expert[] = [{
  id: "wellness-coach",
  name: "Wellness Coach",
  description: "Provides general wellness advice based on your wellness scores",
  icon: LifeBuoy,
  specialty: "General wellness, habit building, and lifestyle improvement"
}, {
  id: "self-love-expert",
  name: "Self-Love Expert",
  description: "Inspired by the Five Keys of Self-Love book",
  icon: ThumbsUp,
  specialty: "Self-love practices, affirmations, and personal growth strategies"
}, {
  id: "data-analyst",
  name: "Wellness Analyst",
  description: "Analyzes your wellness data trends and suggests improvements",
  icon: Brain,
  specialty: "Data analysis, pattern identification, and evidence-based recommendations"
}, {
  id: "marketplace-guide",
  name: "Marketplace Guide",
  description: "Recommends products from the Wellness Marketplace",
  icon: Sparkles,
  specialty: "Product recommendations based on your wellness needs"
}];
const AICompanionPage = () => {
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert>(experts[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch user's wellness data
  const {
    data: wellnessData
  } = useQuery({
    queryKey: ['wellnessEntries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const {
        data,
        error
      } = await supabase.from('wellness_entries').select('*, wellness_ratings(*)').eq('user_id', user.id).order('date', {
        ascending: false
      });
      if (error) {
        console.error('Error fetching wellness entries:', error);
        throw error;
      }
      return data;
    },
    enabled: !!user
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  // Add greeting message when expert is selected
  useEffect(() => {
    if (selectedExpert) {
      const greetingMessage = selectedExpert.id === "marketplace-guide" ? `Hi! I'm your ${selectedExpert.name}. ${selectedExpert.description}. I specialize in ${selectedExpert.specialty}. You can ask me about products in our Wellness Marketplace or visit the marketplace directly to browse all offerings.` : `Hi! I'm your ${selectedExpert.name}. ${selectedExpert.description}. I specialize in ${selectedExpert.specialty}. How can I help you today?`;
      setMessages([{
        role: "assistant",
        content: greetingMessage,
        timestamp: new Date(),
        expertType: selectedExpert.id
      }]);
    }
  }, [selectedExpert]);
  const handleExpertChange = (expertId: string) => {
    const expert = experts.find(e => e.id === expertId);
    if (expert) {
      setSelectedExpert(expert);
    }
  };
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    try {
      // In a real implementation, we would call an edge function here
      // that would process the message with an AI model

      // For now, simulate a response based on the selected expert
      setTimeout(() => {
        const simulatedResponse = generateSimulatedResponse(inputMessage, selectedExpert, wellnessData);
        const assistantMessage: Message = {
          role: "assistant",
          content: simulatedResponse,
          timestamp: new Date(),
          expertType: selectedExpert.id
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1200);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from Weallth AI Companion",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Simulated response generation based on expert type and user message
  const generateSimulatedResponse = (message: string, expert: Expert, wellnessData: any) => {
    const latestWellness = wellnessData && wellnessData.length > 0 ? wellnessData[0] : null;
    const overallScore = latestWellness?.overall_score || "unknown";
    const category = latestWellness?.category || "unknown";
    const lowercaseMessage = message.toLowerCase();
    switch (expert.id) {
      case "wellness-coach":
        if (lowercaseMessage.includes("score") || lowercaseMessage.includes("wellness")) {
          return `Based on your latest wellness score of ${overallScore} (${category}), I'd recommend focusing on maintaining a consistent sleep schedule and staying hydrated throughout the day. Small improvements in these areas can significantly impact your overall wellness.`;
        } else {
          return "As your wellness coach, I recommend establishing a morning routine that includes mindfulness practice and movement. This sets a positive tone for the day and helps manage stress. Remember, consistency is key to building healthy habits!";
        }
      case "self-love-expert":
        return "The Five Keys of Self-Love emphasize the importance of self-acceptance and compassionate self-talk. Try taking a few minutes each day to acknowledge your strengths and progress. Remember that self-love is not selfish; it's necessary for your well-being and for showing up fully for others in your life.";
      case "data-analyst":
        if (wellnessData && wellnessData.length > 0) {
          return `I've analyzed your wellness data from the past ${wellnessData.length} entries. Your overall trend is ${wellnessData.length > 1 && wellnessData[0].overall_score > wellnessData[1].overall_score ? "improving" : "stable or slightly declining"}. The area with the most potential for improvement appears to be your consistency in tracking. More consistent data would help identify specific patterns and provide more personalized recommendations.`;
        } else {
          return "I don't have enough data to analyze trends yet. As you continue tracking your wellness metrics, I'll be able to provide more insightful analysis and personalized recommendations.";
        }
      case "marketplace-guide":
        if (lowercaseMessage.includes("recommend") || lowercaseMessage.includes("suggest")) {
          return "Based on your wellness profile and interests, I recommend checking out our meditation cushion sets and the 'Sound Bath Experience' service in our marketplace. You can view these and other personalized recommendations by visiting our Marketplace page. Would you like me to suggest more specific products based on any particular wellness goal?";
        } else if (lowercaseMessage.includes("marketplace") || lowercaseMessage.includes("products")) {
          return "You can explore our full Wellness Marketplace for products, services, retreats, and consultations. Simply click on the 'Marketplace' link in the navigation menu, or I can tell you about some featured items. The marketplace includes verified providers and user reviews to help you make informed decisions.";
        } else {
          return "Our Wellness Marketplace features a variety of products and services to support your wellness journey. From meditation cushions to wellness retreats to expert consultations - we've curated the best offerings from verified providers. You can browse the full marketplace by clicking on the Marketplace link in the navigation. Is there a specific type of product or service you're interested in?";
        }
      default:
        return "I'm here to support you on your wellness journey. What specific aspect of your wellness would you like to focus on today?";
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Weallth - Your Personal Wellness Companion</h1>
            <p className="text-muted-foreground">
              Your personalized wellness guide with expert insights and recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Experts sidebar */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Wellness Experts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={selectedExpert.id} orientation="vertical" onValueChange={handleExpertChange} className="space-y-4">
                <TabsList className="flex flex-col h-auto items-stretch gap-2">
                  {experts.map(expert => <TabsTrigger key={expert.id} value={expert.id} className="justify-start gap-3 p-3 h-auto">
                      <expert.icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">{expert.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {expert.description}
                        </div>
                      </div>
                    </TabsTrigger>)}
                </TabsList>
              </Tabs>

              <div className="mt-6 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Info className="h-4 w-4" />
                  About {selectedExpert.name}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedExpert.specialty}
                </p>
              </div>
              
              {selectedExpert.id === "marketplace-guide" && <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => window.location.href = "/marketplace"}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Visit Marketplace
                  </Button>
                </div>}
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="lg:col-span-9 flex flex-col h-[700px]">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <selectedExpert.icon className="h-5 w-5" />
                Chat with {selectedExpert.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => <AIMessage key={index} message={message.content} isUser={message.role === "user"} expertType={message.expertType} />)}
              {isLoading && <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-pulse">Thinking...</div>
                </div>}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-4 border-t mt-auto">
              <div className="flex gap-2">
                <Textarea value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask your wellness question..." className="resize-none min-h-[60px]" disabled={isLoading} />
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} className="px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>;
};
export default AICompanionPage;