
import { format } from "date-fns";
import { MessageData } from "@/types/message";

interface MessageItemProps {
  message: MessageData;
  isCurrentUser: boolean;
}

export const MessageItem = ({ message, isCurrentUser }: MessageItemProps) => {
  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "p"); // Format as time (e.g., 3:30 PM)
    } catch (error) {
      return "";
    }
  };

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div 
        className={`max-w-[75%] rounded-lg p-3 ${
          isCurrentUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        }`}
      >
        <p>{message.content}</p>
        <p className={`text-xs mt-1 ${
          isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
        }`}>
          {formatMessageTime(message.created_at)}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
