
import { Check, Clock, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { WellnessRating } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

interface BabyStepsListProps {
  ratings: WellnessRating[];
  onStepToggle: (metricId: string, completed: boolean) => void;
}

const BabyStepsList = ({ ratings, onStepToggle }: BabyStepsListProps) => {
  const { toast } = useToast();
  const [starsEarned, setStarsEarned] = useState(0);
  
  // On component mount, load stars from localStorage
  useEffect(() => {
    const savedStars = localStorage.getItem('wellnessStars');
    if (savedStars) {
      setStarsEarned(parseInt(savedStars, 10));
    }
  }, []);
  
  const stepsWithNames = ratings.map(rating => {
    const metric = wellnessMetrics.find(m => m.id === rating.metricId);
    return {
      ...rating,
      metricName: metric?.name || ""
    };
  });
  
  const completedCount = stepsWithNames.filter(step => step.completed).length;
  const progress = stepsWithNames.length > 0 ? (completedCount / stepsWithNames.length) * 100 : 0;
  
  // Show confetti celebration effect
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#9370DB', '#7B68EE'],
        shapes: ['star', 'circle'],
        ticks: 200
      });
      
      // Add a second burst for more festivity
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 }
        });
      }, 250);
    } catch (error) {
      console.error("Error triggering confetti:", error);
    }
  };
  
  const handleStepToggle = (metricId: string, completed: boolean) => {
    // Call the parent handler
    onStepToggle(metricId, completed);
    
    // Show celebration and increase star count if checked
    if (completed) {
      triggerCelebration();
      
      // Update stars in local storage
      const newStarsCount = starsEarned + 1;
      setStarsEarned(newStarsCount);
      localStorage.setItem('wellnessStars', newStarsCount.toString());
      
      toast({
        title: "🎉 Goal achieved! 🎉",
        description: "Amazing job! You've earned a star for your wellness bank!",
        duration: 5000,
      });
    } else if (starsEarned > 0) {
      // Decrease star count if unchecking
      const newStarsCount = starsEarned - 1;
      setStarsEarned(newStarsCount);
      localStorage.setItem('wellnessStars', newStarsCount.toString());
      
      toast({
        title: "Step unmarked",
        description: "You can complete it later when you're ready.",
        duration: 1500,
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Today's Baby Steps</CardTitle>
            <CardDescription>Small steps toward better wellness</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">
              {completedCount}/{stepsWithNames.length}
            </div>
            {starsEarned > 0 && (
              <div className="flex items-center bg-amber-100 px-2 py-0.5 rounded-full">
                <Star className="h-3 w-3 text-amber-500 mr-0.5 fill-amber-500" />
                <span className="text-amber-700 text-xs font-medium">{starsEarned}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
          <div 
            className="bg-wellness-purple h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="space-y-3 max-h-[320px] overflow-y-auto">
          {stepsWithNames.map((step) => (
            <div key={`${step.metricId}-${step.babyStep}`} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <Checkbox
                checked={step.completed}
                onCheckedChange={(checked) => 
                  handleStepToggle(step.metricId, checked as boolean)
                }
                className="mt-1"
              />
              <div className="flex-1">
                <p className={`text-sm font-medium ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
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
      </CardContent>
    </Card>
  );
};

export default BabyStepsList;
