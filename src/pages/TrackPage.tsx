import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import WellnessMetricCard from "@/components/WellnessMetricCard";
import { Button } from "@/components/ui/button";
import { wellnessMetrics, getWellnessCategory } from "@/data/wellnessMetrics";
import { WellnessRating, DailyWellnessEntry, WellnessScoreCategory } from "@/types/wellness";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, ChartPie } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WellnessScoreDisplay from "@/components/WellnessScoreDisplay";
import { Progress } from "@/components/ui/progress";
import BabyStepsTracker from "@/components/BabyStepsTracker";
import WellnessSummary from "@/components/WellnessSummary";
import { demoWellnessData } from "@/data/wellnessMetrics";

const TrackPage = () => {
  const [ratings, setRatings] = useState<WellnessRating[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showBabySteps, setShowBabySteps] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [category, setCategory] = useState<WellnessScoreCategory>("Healthy");
  const [historyData, setHistoryData] = useState<DailyWellnessEntry[]>(demoWellnessData.entries as DailyWellnessEntry[]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Adding a helper to count metrics with scores
  const ratedMetricsCount = ratings.filter(r => r.score > 0).length;

  const handleSaveRating = (rating: WellnessRating) => {
    // Check if we already have a rating for this metric
    const existingIndex = ratings.findIndex(r => r.metricId === rating.metricId);
    
    if (existingIndex >= 0) {
      // Update existing rating
      const updatedRatings = [...ratings];
      updatedRatings[existingIndex] = rating;
      setRatings(updatedRatings);
    } else {
      // Add new rating
      setRatings(prev => [...prev, rating]);
    }
    
    toast({
      title: "Rating saved",
      description: `Your rating for ${wellnessMetrics.find(m => m.id === rating.metricId)?.name} has been saved.`,
      duration: 1500,
    });
  };
  
  const handleSubmit = () => {
    // Modified to check for scores only, not baby steps
    const metricsWithScores = ratings.filter(r => r.score > 0);
    
    if (metricsWithScores.length < wellnessMetrics.length) {
      toast({
        title: "All metrics need ratings",
        description: `Please rate all 10 wellness metrics before submitting. (${metricsWithScores.length}/10 rated)`,
        variant: "destructive"
      });
      return;
    }
    
    // Calculate overall wellness score (average of all ratings)
    const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
    const calculatedOverallScore = totalScore / ratings.length;
    const wellnessCategory = getWellnessCategory(calculatedOverallScore);
    
    // Set the calculated values to state
    setOverallScore(calculatedOverallScore);
    setCategory(wellnessCategory);
    setSubmitted(true);
    
    // Create a new daily wellness entry
    const newEntry: DailyWellnessEntry = {
      date: new Date().toISOString().split('T')[0],
      ratings,
      overallScore: calculatedOverallScore,
      category: wellnessCategory
    };
    
    // Add the new entry to the history
    setHistoryData(prev => [...prev, newEntry]);
    
    toast({
      title: "Wellness tracked successfully!",
      description: `Your overall wellness score today is ${calculatedOverallScore.toFixed(1)} - ${wellnessCategory}`,
    });
  };
  
  const handleToggleBabyStep = (metricId: string, completed: boolean) => {
    // Update the ratings state with the new completed status
    setRatings(prev => 
      prev.map(rating => 
        rating.metricId === metricId 
          ? { ...rating, completed } 
          : rating
      )
    );
  };
  
  const handleViewBabySteps = () => {
    setShowBabySteps(true);
  };
  
  const handleGoToDashboard = () => {
    navigate('/');
  };
  
  const handleToggleSummary = () => {
    setShowSummary(prev => !prev);
  };
  
  // Calculate completion percentage based on scored metrics only
  const completionPercentage = (ratedMetricsCount / wellnessMetrics.length) * 100;
  
  // Debug to check ratings state
  useEffect(() => {
    console.log("Current ratings:", ratedMetricsCount, "of", wellnessMetrics.length);
  }, [ratings, ratedMetricsCount]);
  
  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        {showSummary ? (
          <WellnessSummary 
            data={historyData} 
            onClose={() => setShowSummary(false)} 
          />
        ) : !submitted ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Track Today's Wellness</h1>
                <p className="text-muted-foreground">
                  Rate each of your 10 core wellness metrics and set baby steps for improvement
                </p>
              </div>
              <Button 
                onClick={handleToggleSummary} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ChartPie className="h-5 w-5" />
                Summary
              </Button>
            </div>
            
            <Alert className="bg-wellness-mint border-wellness-teal">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Track Your Wellness Daily</AlertTitle>
              <AlertDescription>
                For best results, track your wellness metrics at the same time each day.
                Rate each area honestly - adding baby steps for improvement is optional.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center space-x-2">
              <span className="font-medium">{ratedMetricsCount} of {wellnessMetrics.length} metrics rated</span>
              <Progress value={completionPercentage} className="w-32 h-2" />
            </div>
            
            {ratedMetricsCount < wellnessMetrics.length && (
              <Alert variant="default" className="bg-muted/50">
                <AlertTitle>Rate all 10 metrics to continue</AlertTitle>
                <AlertDescription>
                  Set a score (1-5 stars) for each metric. Baby steps for improvement are optional.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wellnessMetrics.map(metric => (
                <WellnessMetricCard
                  key={metric.id}
                  metric={metric}
                  initialRating={ratings.find(r => r.metricId === metric.id)}
                  onSave={handleSaveRating}
                />
              ))}
            </div>

            <div className="flex justify-center mt-6 mb-10">
              <Button 
                onClick={handleSubmit} 
                size="lg" 
                variant="default"
                disabled={ratedMetricsCount < wellnessMetrics.length}
                className="px-8 bg-wellness-teal hover:bg-wellness-teal/90 text-white"
              >
                {ratedMetricsCount < wellnessMetrics.length ? (
                  <>Submit Today's Wellness Tracking ({ratedMetricsCount}/{wellnessMetrics.length})</>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Complete Tracking
                  </>
                )}
              </Button>
            </div>
          </>
        ) : !showBabySteps ? (
          <div className="flex flex-col items-center space-y-6 py-8">
            <div className="w-full max-w-md">
              <WellnessScoreDisplay
                score={overallScore}
                category={category as any}
                previousScore={undefined}
              />
            </div>
            <div className="text-center space-y-4">
              <p className="text-lg">
                Thank you for tracking your wellness today! Your data has been saved.
              </p>
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 justify-center">
                <Button onClick={handleViewBabySteps} size="lg" className="bg-wellness-purple hover:bg-wellness-purple/90">
                  View Baby Steps Tracker
                </Button>
                <Button onClick={handleToggleSummary} size="lg" className="bg-wellness-teal hover:bg-wellness-teal/90">
                  View Wellness Summary
                </Button>
                <Button onClick={handleGoToDashboard} size="lg" variant="outline">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Your Baby Steps</h1>
                <p className="text-muted-foreground">
                  Track your daily progress on the baby steps you've set
                </p>
              </div>
              <Button onClick={handleToggleSummary} variant="outline" className="flex items-center gap-2">
                <ChartPie className="h-5 w-5" />
                View Summary
              </Button>
            </div>
            
            <div className="mb-6">
              <WellnessScoreDisplay
                score={overallScore}
                category={category as any}
                previousScore={undefined}
              />
            </div>
            
            <BabyStepsTracker 
              ratings={ratings} 
              onComplete={handleGoToDashboard}
              onToggleStep={handleToggleBabyStep}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TrackPage;
