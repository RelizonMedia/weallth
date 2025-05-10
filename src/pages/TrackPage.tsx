
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import WellnessMetricCard from "@/components/WellnessMetricCard";
import { Button } from "@/components/ui/button";
import { wellnessMetrics, getWellnessCategory } from "@/data/wellnessMetrics";
import { WellnessRating } from "@/types/wellness";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WellnessScoreDisplay from "@/components/WellnessScoreDisplay";
import { Progress } from "@/components/ui/progress";

const TrackPage = () => {
  const [ratings, setRatings] = useState<WellnessRating[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [category, setCategory] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

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
    // Calculate overall wellness score (average of all ratings)
    const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
    const calculatedOverallScore = totalScore / ratings.length;
    const wellnessCategory = getWellnessCategory(calculatedOverallScore);
    
    // Set the calculated values to state
    setOverallScore(calculatedOverallScore);
    setCategory(wellnessCategory);
    setSubmitted(true);
    
    console.log("Submitting wellness entry:", {
      date: new Date().toISOString().split('T')[0],
      ratings,
      overallScore: calculatedOverallScore,
      category: wellnessCategory
    });
    
    toast({
      title: "Wellness tracked successfully!",
      description: `Your overall wellness score today is ${calculatedOverallScore.toFixed(1)} - ${wellnessCategory}`,
    });
  };
  
  const handleGoToDashboard = () => {
    navigate('/');
  };
  
  // Calculate completion percentage
  const completionPercentage = (ratings.length / wellnessMetrics.length) * 100;
  
  // Debug to check ratings state
  useEffect(() => {
    console.log("Current ratings:", ratings.length, "of", wellnessMetrics.length);
  }, [ratings]);
  
  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Track Today's Wellness</h1>
          <p className="text-muted-foreground">
            Rate each of your 10 core wellness metrics and set baby steps for improvement
          </p>
        </div>
        
        <Alert className="bg-wellness-mint border-wellness-teal">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Track Your Wellness Daily</AlertTitle>
          <AlertDescription>
            For best results, track your wellness metrics at the same time each day.
            Reflect honestly on each area and set achievable baby steps.
          </AlertDescription>
        </Alert>
        
        {submitted ? (
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
              <Button onClick={handleGoToDashboard} size="lg">
                Go to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{ratings.length} of {wellnessMetrics.length} metrics rated</span>
              <Progress value={completionPercentage} className="w-32 h-2" />
            </div>
            
            {ratings.length < wellnessMetrics.length && (
              <Alert variant="default" className="bg-muted/50">
                <AlertTitle>Rate all 10 metrics to continue</AlertTitle>
                <AlertDescription>
                  Set a score (1-5 stars) and add one baby step for improvement for each metric.
                  Your ratings will automatically be saved once both are complete.
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
                disabled={ratings.length < wellnessMetrics.length}
                className="px-8 bg-wellness-teal hover:bg-wellness-teal/90 text-white"
              >
                {ratings.length < wellnessMetrics.length ? (
                  <>Submit Today's Wellness Tracking ({ratings.length}/{wellnessMetrics.length})</>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Complete Tracking
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default TrackPage;
