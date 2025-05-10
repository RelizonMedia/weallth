
import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatButtonProps {
  className?: string;
}

const ChatButton = ({ className }: ChatButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/ai-companion");
  };

  return (
    <Button
      onClick={handleClick}
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-gradient-to-r from-wellness-purple to-wellness-teal hover:from-wellness-teal hover:to-wellness-purple transition-all duration-300",
        className
      )}
      aria-label="Chat with Weallth AI"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  );
};

export default ChatButton;
