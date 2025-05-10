
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
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {showingHistory ? "My Wellness Tracking" : "Track Today's Wellness"}
            </h1>
            <p className="text-muted-foreground">
              {showingHistory 
                ? "View your complete wellness journey with detailed metrics and trends"
                : "Rate each of your 10 core wellness metrics and set baby steps for improvement"
              }
            </p>
          </div>
          
          <div className="flex gap-2">
            {showingHistory && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                asChild
              >
                <Link to="/goal-tracker">
                  <Target className="h-4 w-4" />
                  View Goal Tracker
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
              className="flex items-center gap-2"
            >
              <CalendarPlus className="h-4 w-4" />
              {showingHistory ? "Track New Entry" : "View History"}
            </Button>
          </div>
        </div>
        
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
    </Layout>
  );
};

export default TrackPage;
