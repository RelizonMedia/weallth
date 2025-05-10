
import { MessageData } from "@/types/message";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: MessageData[];
  currentUserId: string;
}

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <MessageItem 
          key={msg.id}
          message={msg}
          isCurrentUser={msg.sender_id === currentUserId}
        />
      ))}
    </div>
  );
};

export default MessageList;
