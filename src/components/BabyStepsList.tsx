
import { Check, Clock, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { WellnessRating } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { PartyPopper, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BabyStepsListProps {
  ratings: WellnessRating[];
  onStepToggle: (metricId: string, completed: boolean) => void;
}

const BabyStepsList = ({ ratings, onStepToggle }: BabyStepsListProps) => {
  const { toast } = useToast();
  const [starsEarned, setStarsEarned] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedStep, setCelebratedStep] = useState<string>("");
  const [completionTime, setCompletionTime] = useState<string>("");
  
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
  
  // Get motivational messages for celebrations
  const getMotivationalMessage = () => {
    const messages = [
      "You're doing amazing! Every step counts toward your wellness journey.",
      "That's the way! Your commitment to your wellness is truly inspiring.",
      "Fantastic progress! You're building healthy habits one step at a time.",
      "Excellent work! Your dedication to wellness is something to celebrate.",
      "Great job! Small steps lead to big changes in your wellness journey."
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  const handleStepToggle = (metricId: string, completed: boolean, stepName: string) => {
    // Call the parent handler
    onStepToggle(metricId, completed);
    
    // Record the exact completion time
    const now = new Date();
    const formattedTime = format(now, "MMM dd, yyyy 'at' h:mm a");
    setCompletionTime(formattedTime);
    
    // Show celebration and increase star count if checked
    if (completed) {
      triggerCelebration();
      
      // Set the celebrated step for the dialog
      setCelebratedStep(stepName);
      setShowCelebration(true);
      
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
                  handleStepToggle(step.metricId, checked as boolean, step.babyStep)
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
        
        {/* Celebration Dialog */}
        <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-amber-600 flex items-center justify-center gap-2">
                <PartyPopper className="h-6 w-6 text-amber-500" />
                Celebration Time!
                <PartyPopper className="h-6 w-6 text-amber-500" />
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center py-4">
              <div className="bg-amber-50 rounded-full p-6 mb-4">
                <Award className="h-16 w-16 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Amazing Achievement!</h3>
              <p className="text-center mb-2">
                You've completed: <span className="font-bold">{celebratedStep}</span>
              </p>
              <p className="text-center text-muted-foreground mb-4">
                {getMotivationalMessage()}
              </p>
              <div className="bg-amber-100 rounded-full px-4 py-2 flex items-center mb-4">
                <Star className="h-5 w-5 text-amber-500 mr-2 fill-amber-500" />
                <span className="text-amber-700 font-medium">+1 Star Added to Your Wellness Bank!</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Completed on {completionTime}
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => setShowCelebration(false)} className="bg-wellness-purple hover:bg-wellness-purple/90">
                Continue My Journey
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BabyStepsList;
