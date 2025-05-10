
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface EmptyConversationProps {
  onNewMessage: () => void;
}

export const EmptyConversation = ({ onNewMessage }: EmptyConversationProps) => {
  return (
    <div className="flex items-center justify-center h-full text-center p-8">
      <div>
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/60" />
        <h3 className="text-xl font-medium mt-4">Select a conversation</h3>
        <p className="text-muted-foreground mt-1 max-w-sm">
          Choose a conversation from the list or start a new one
        </p>
        <Button 
          onClick={onNewMessage} 
          className="mt-4"
        >
          New Message
        </Button>
      </div>
    </div>
  );
};

export default EmptyConversation;
