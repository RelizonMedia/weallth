
import { useState } from "react";
import Layout from "@/components/Layout";
import WellnessMetricCard from "@/components/WellnessMetricCard";
import { Button } from "@/components/ui/button";
import { wellnessMetrics, getWellnessCategory } from "@/data/wellnessMetrics";
import { WellnessRating } from "@/types/wellness";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const TrackPage = () => {
  const [ratings, setRatings] = useState<WellnessRating[]>([]);
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
      duration: 3000,
    });
  };
  
  const handleSubmit = () => {
    // Check if all metrics have been rated
    if (ratings.length < wellnessMetrics.length) {
      toast({
        title: "Incomplete ratings",
        description: "Please rate all 10 wellness metrics before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate overall wellness score (average of all ratings)
    const totalScore = ratings.reduce((sum, rating) => sum + rating.score, 0);
    const overallScore = totalScore / ratings.length;
    const category = getWellnessCategory(overallScore);
    
    console.log("Submitting wellness entry:", {
      date: new Date().toISOString().split('T')[0],
      ratings,
      overallScore,
      category
    });
    
    toast({
      title: "Wellness tracked successfully!",
      description: `Your overall wellness score today is ${overallScore.toFixed(1)} - ${category}`,
    });
    
    // Navigate back to dashboard
    navigate('/');
  };
  
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
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSubmit} 
            size="lg" 
            disabled={ratings.length < wellnessMetrics.length}
          >
            Submit Today's Wellness Tracking
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default TrackPage;
