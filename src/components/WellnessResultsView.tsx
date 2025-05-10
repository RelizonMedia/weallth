
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WellnessRating, DailyWellnessEntry } from "@/types/wellness";
import WellnessSummary from "@/components/wellness-summary/WellnessSummary";
import BabyStepsTracker from "@/components/BabyStepsTracker";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface WellnessResultsViewProps {
  ratings: WellnessRating[];
  historyData: DailyWellnessEntry[];
  onToggleBabyStep: (metricId: string, completed: boolean) => void;
}

const WellnessResultsView = ({ 
  ratings, 
  historyData,
  onToggleBabyStep 
}: WellnessResultsViewProps) => {
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(true);
  
  const handleGoToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="py-1 md:py-2 space-y-3 w-full max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div className="max-w-full overflow-hidden">
          <h1 className="text-lg md:text-xl font-bold">Wellness Tracking</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Your wellness tracking results and historical data
          </p>
        </div>
        <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
          Back to Dashboard
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <Switch 
          id="view-toggle" 
          checked={showSummary}
          onCheckedChange={setShowSummary}
        />
        <label 
          htmlFor="view-toggle" 
          className="text-xs md:text-sm font-medium cursor-pointer truncate"
        >
          {showSummary ? "Showing Wellness Summary" : "Showing Goal Tracker"}
        </label>
      </div>
      
      {/* Conditional rendering based on toggle state */}
      <div className="w-full max-w-full overflow-hidden">
        {showSummary ? (
          <WellnessSummary 
            data={historyData} 
            onClose={() => setShowSummary(false)}
          />
        ) : (
          <BabyStepsTracker 
            ratings={ratings} 
            onComplete={handleGoToDashboard}
            onToggleStep={onToggleBabyStep}
          />
        )}
      </div>
    </div>
  );
};

export default WellnessResultsView;
