
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const AiCompanionCallout = () => {
  return (
    <div className="bg-accent/30 p-6 rounded-lg border border-accent/50">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold">Need wellness advice?</h3>
          <p className="text-muted-foreground mt-2">
            Chat with Weallth AI Companion for personalized insights and recommendations based on your wellness data.
          </p>
        </div>
        <Button asChild>
          <Link to="/ai-companion">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat with Weallth AI
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AiCompanionCallout;
