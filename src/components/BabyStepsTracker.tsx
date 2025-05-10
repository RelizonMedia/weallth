
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WellnessRating } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Clock, Calendar, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import confetti from "canvas-confetti";

interface BabyStepsTrackerProps {
  ratings: WellnessRating[];
  onComplete: () => void;
  onToggleStep: (metricId: string, completed: boolean) => void;
}

const BabyStepsTracker = ({ ratings, onComplete, onToggleStep }: BabyStepsTrackerProps) => {
  const { toast } = useToast();
  const [stepsWithData, setStepsWithData] = useState(
    ratings.map(rating => {
      const metric = wellnessMetrics.find(m => m.id === rating.metricId);
      return {
        ...rating,
        metricName: metric?.name || ""
      };
    })
  );
  const [starsEarned, setStarsEarned] = useState(0);
  
  // Filter out ratings without baby steps
  const babySteps = stepsWithData.filter(step => step.babyStep.trim() !== '');
  
  // Count completed steps
  const completedCount = babySteps.filter(step => step.completed).length;
  const progress = babySteps.length > 0 ? (completedCount / babySteps.length) * 100 : 0;
  
  // Format the date when the baby steps were created
  const formattedDate = ratings.length > 0 ? format(new Date(ratings[0].date), 'MMM dd, yyyy') : format(new Date(), 'MMM dd, yyyy');
  
  // Show confetti celebration effect
  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };
  
  const handleToggle = (metricId: string, checked: boolean) => {
    // Update local state
    setStepsWithData(prev => 
      prev.map(step => 
        step.metricId === metricId ? { ...step, completed: checked } : step
      )
    );
    
    // Call the parent handler
    onToggleStep(metricId, checked);
    
    // Show celebration and increase star count if checked
    if (checked) {
      triggerCelebration();
      setStarsEarned(prev => prev + 1);
      
      toast({
        title: "Goal achieved! 🎉",
        description: "You've earned a star for your wellness bank!",
        duration: 3000,
      });
    } else {
      toast({
        title: "Step marked as not completed",
        description: "You can complete it later when you're ready.",
        duration: 1500,
      });
    }
  };
  
  const handleAllComplete = () => {
    toast({
      title: "Great job!",
      description: "You've tracked your wellness and followed up on your baby steps.",
      duration: 3000,
    });
    onComplete();
  };
  
  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Baby Step Goal Tracker</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" /> 
              Created on {formattedDate}
            </p>
          </div>
          {starsEarned > 0 && (
            <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
              <span className="text-amber-700 font-medium">{starsEarned}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {babySteps.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">You haven't set any baby steps to track.</p>
            <Button onClick={onComplete} className="mt-4">
              Return to Dashboard
            </Button>
          </div>
        ) : (
          <>
            <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
              <div 
                className="bg-wellness-purple h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="text-sm font-medium mb-2">
              {completedCount} of {babySteps.length} baby steps completed
            </div>
            
            <div className="space-y-4 my-4">
              {babySteps.map((step) => (
                <div key={step.metricId} className="flex items-start space-x-3 p-3 rounded-md bg-muted/30">
                  <Checkbox
                    checked={step.completed}
                    onCheckedChange={(checked) => 
                      handleToggle(step.metricId, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {step.babyStep}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-muted-foreground">
                        {step.metricName}
                      </p>
                      {step.completed && (
                        <p className="text-xs text-muted-foreground">
                          Completed: {format(new Date(), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                  {step.completed ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      <Check className="mr-0.5 h-3 w-3" />
                      Done
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                      <Clock className="mr-0.5 h-3 w-3" />
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button onClick={handleAllComplete} size="lg" className="bg-wellness-purple hover:bg-wellness-purple/90">
                Complete Tracking
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BabyStepsTracker;
