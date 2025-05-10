
import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";
import WellnessTrackingForm from "@/components/WellnessTrackingForm";
import WellnessResultsView from "@/components/WellnessResultsView";
import { useWellnessTracking } from "@/hooks/wellness/useWellnessTracking";
import WellnessSummary from "@/components/wellness-summary/WellnessSummary";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Target } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const TrackPage = () => {
  const {
    ratings,
    submitted,
    historyData,
    isLoading,
    handleSubmit,
    handleToggleBabyStep,
    setSubmitted
  } = useWellnessTracking();
  
  // Get the current location to check for query parameters
  const location = useLocation();
  
  // Add state to control view between history and form
  const [showingHistory, setShowingHistory] = useState(true);
  
  // Check URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    
    // If mode=new, show the tracking form
    if (mode === 'new') {
      setShowingHistory(false);
    }
  }, [location]);
  
  // Check if we're still loading data
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center">
            <p className="text-lg mb-4">Loading your wellness data...</p>
            <Progress value={undefined} className="w-48 h-2" />
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="flex flex-col space-y-4 w-full max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="max-w-full overflow-hidden">
            <h1 className="text-lg md:text-2xl font-bold truncate">
              {showingHistory ? "My Wellness Tracking" : "Track Today's Wellness"}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">
              {showingHistory 
                ? "View your wellness journey with detailed metrics"
                : "Rate your wellness metrics and set steps for improvement"
              }
            </p>
          </div>
          
          <div className="flex flex-shrink-0 gap-2">
            {showingHistory && (
              <Button 
                variant="outline" 
                className="flex items-center gap-1 text-xs whitespace-nowrap"
                asChild
                size="sm"
              >
                <Link to="/goal-tracker">
                  <Target className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="truncate">Goal Tracker</span>
                </Link>
              </Button>
            )}
            
            <Button 
              onClick={() => {
                if (showingHistory) {
                  setShowingHistory(false);
                } else {
                  setShowingHistory(true);
                  setSubmitted(false);
                }
              }} 
              variant="outline"
              className="flex items-center gap-1 text-xs whitespace-nowrap"
              size="sm"
            >
              <CalendarPlus className="h-3 w-3 md:h-4 md:w-4" />
              <span className="truncate">{showingHistory ? "Track New Entry" : "View History"}</span>
            </Button>
          </div>
        </div>
        
        <div className="max-w-full overflow-hidden">
          {showingHistory && (
            <WellnessSummary 
              data={historyData} 
              onClose={() => setShowingHistory(false)}
            />
          )}
          
          {!showingHistory && !submitted && (
            <WellnessTrackingForm onSubmit={handleSubmit} />
          )}
          
          {!showingHistory && submitted && (
            <WellnessResultsView 
              ratings={ratings}
              historyData={historyData}
              onToggleBabyStep={handleToggleBabyStep}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackPage;
