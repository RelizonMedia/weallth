
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarPlus, MessageCircle } from "lucide-react";

const TrackingPrompt = () => {
  return (
    <div className="flex items-center justify-center p-6 bg-muted/50 rounded-lg border border-dashed">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-medium">Track Today's Wellness</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Take a few minutes to reflect on your wellness metrics and set your baby steps for improvement.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link to="/track?mode=new">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Track Today
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/ai-companion">
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat with Weallth AI
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackingPrompt;
