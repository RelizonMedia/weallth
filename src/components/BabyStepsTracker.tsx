
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WellnessRating } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  
  // Filter out ratings without baby steps
  const babySteps = stepsWithData.filter(step => step.babyStep.trim() !== '');
  
  // Count completed steps
  const completedCount = babySteps.filter(step => step.completed).length;
  const progress = babySteps.length > 0 ? (completedCount / babySteps.length) * 100 : 0;
  
  const handleToggle = (metricId: string, checked: boolean) => {
    // Update local state
    setStepsWithData(prev => 
      prev.map(step => 
        step.metricId === metricId ? { ...step, completed: checked } : step
      )
    );
    
    // Call the parent handler
    onToggleStep(metricId, checked);
    
    // Show toast
    toast({
      title: checked ? "Step completed!" : "Step marked as not completed",
      description: `You've ${checked ? "completed" : "unmarked"} this baby step.`,
      duration: 1500,
    });
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
        <CardTitle className="text-2xl">Your Baby Steps Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your progress on the baby steps you defined
        </p>
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
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.metricName}
                    </p>
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
