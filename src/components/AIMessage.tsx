
import { formatDistanceToNow } from "date-fns";
import { LifeBuoy, ThumbsUp, Brain, Sparkles, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AIMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  expertType?: string;
}

const AIMessage = ({ message, isUser, timestamp = new Date(), expertType }: AIMessageProps) => {
  // Get the appropriate icon based on expert type
  const getExpertIcon = (type?: string) => {
    switch (type) {
      case "wellness-coach":
        return <LifeBuoy className="h-4 w-4" />;
      case "self-love-expert":
        return <ThumbsUp className="h-4 w-4" />;
      case "data-analyst":
        return <Brain className="h-4 w-4" />;
      case "marketplace-guide":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  // Get the appropriate avatar fallback based on expert type
  const getAvatarFallback = (type?: string) => {
    if (isUser) return "U";
    
    switch (type) {
      case "wellness-coach":
        return "WC";
      case "self-love-expert":
        return "SL";
      case "data-analyst":
        return "DA";
      case "marketplace-guide":
        return "MP";
      default:
        return "AI";
    }
  };

  // Get the appropriate background color based on expert type
  const getAvatarColor = (type?: string) => {
    if (isUser) return "bg-primary";
    
    switch (type) {
      case "wellness-coach":
        return "bg-blue-500";
      case "self-love-expert":
        return "bg-red-500";
      case "data-analyst":
        return "bg-purple-500";
      case "marketplace-guide":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={isUser ? "" : `/ai-${expertType || "default"}.png`} />
        <AvatarFallback className={getAvatarColor(expertType)}>
          {getAvatarFallback(expertType)}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[80%]`}>
        <div className={`px-4 py-2 rounded-lg ${
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        }`}>
          <p className="whitespace-pre-wrap">{message}</p>
        </div>
        
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          {!isUser && expertType && (
            <>
              {getExpertIcon(expertType)}
              <span className="mr-1 font-medium">
                {expertType === "wellness-coach" ? "Wellness Coach" : 
                 expertType === "self-love-expert" ? "Self-Love Expert" :
                 expertType === "data-analyst" ? "Wellness Analyst" :
                 expertType === "marketplace-guide" ? "Marketplace Guide" : "AI"}
              </span>
              <span>•</span>
            </>
          )}
          {isUser && <User className="h-3 w-3 mr-1" />}
          <time>{formatDistanceToNow(timestamp, { addSuffix: true })}</time>
        </div>
      </div>
    </div>
  );
};

export default AIMessage;
