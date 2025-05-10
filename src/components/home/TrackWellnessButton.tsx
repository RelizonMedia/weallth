
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

const TrackWellnessButton = () => {
  return (
    <div className="flex justify-center">
      <Button 
        asChild 
        className="px-8 py-6 shadow-lg bg-gradient-to-r from-wellness-purple to-wellness-teal hover:from-wellness-teal hover:to-wellness-purple text-white transition-all duration-500" 
        size="lg"
      >
        <Link to="/track?mode=new" className="flex items-center gap-2">
          <CalendarPlus className="h-6 w-6" />
          <span className="text-base font-bold">Track Today's Wellness</span>
        </Link>
      </Button>
    </div>
  );
};

export default TrackWellnessButton;
