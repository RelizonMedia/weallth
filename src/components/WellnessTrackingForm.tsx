
import { useState } from "react";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { WellnessRating } from "@/types/wellness";
import { useToast } from "@/hooks/use-toast";
import WellnessMetricCard from "@/components/WellnessMetricCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

interface WellnessTrackingFormProps {
  onSubmit: (ratings: WellnessRating[]) => void;
}

const WellnessTrackingForm = ({ onSubmit }: WellnessTrackingFormProps) => {
  const [ratings, setRatings] = useState<WellnessRating[]>([]);
  const { toast } = useToast();
  
  // Helper to count metrics with scores
  const ratedMetricsCount = ratings.filter(r => r.score > 0).length;
  
  // Calculate completion percentage based on scored metrics only
  const completionPercentage = (ratedMetricsCount / wellnessMetrics.length) * 100;
  
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
    // Check for scores only, not baby steps
    const metricsWithScores = ratings.filter(r => r.score > 0);
    
    if (metricsWithScores.length < wellnessMetrics.length) {
      toast({
        title: "All metrics need ratings",
        description: `Please rate all 10 wellness metrics before submitting. (${metricsWithScores.length}/10 rated)`,
        variant: "destructive"
      });
      return;
    }
    
    // Pass the ratings to the parent component
    onSubmit(ratings);
  };
  
  return (
    <>
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
  );
};

export default WellnessTrackingForm;
