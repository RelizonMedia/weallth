
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WellnessRating, DailyWellnessEntry } from "@/types/wellness";
import WellnessSummary from "@/components/WellnessSummary";
import BabyStepsTracker from "@/components/BabyStepsTracker";

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
  
  const handleGoToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="py-4 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Wellness Summary</h1>
          <p className="text-muted-foreground">
            Your wellness tracking results and historical data
          </p>
        </div>
        <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2">
          Back to Dashboard
        </Button>
      </div>
      
      {/* Full wellness summary displayed directly on the track page */}
      <WellnessSummary 
        data={historyData} 
        onClose={() => {}} // Empty function since we're not using the close functionality here
      />
      
      {/* Baby Steps Tracker */}
      <BabyStepsTracker 
        ratings={ratings} 
        onComplete={handleGoToDashboard}
        onToggleStep={onToggleBabyStep}
      />
    </div>
  );
};

export default WellnessResultsView;
