
import { MessageData } from "@/types/message";
import MessageHeader from "./MessageHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface MessageContentProps {
  selectedConversation: string | null;
  recipientName: string;
  messages: MessageData[];
  onSendMessage: (text: string) => void;
  currentUserId: string;
}

export const MessageContent = ({
  selectedConversation,
  recipientName,
  messages,
  onSendMessage,
  currentUserId
}: MessageContentProps) => {
  return (
    <div className="flex flex-col h-[80vh]">
      <MessageHeader 
        recipientId={selectedConversation} 
        recipientName={recipientName} 
      />
      
      <MessageList 
        messages={messages} 
        currentUserId={currentUserId} 
      />
      
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default MessageContent;
