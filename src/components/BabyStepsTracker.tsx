
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WellnessRating } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Clock, Calendar, Star, Edit, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import confetti from "canvas-confetti";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  
  // On component mount, load stars from localStorage
  useEffect(() => {
    const savedStars = localStorage.getItem('wellnessStars');
    if (savedStars) {
      setStarsEarned(parseInt(savedStars, 10));
    }
  }, []);
  
  // Filter out ratings without baby steps
  const babySteps = stepsWithData.filter(step => step.babyStep.trim() !== '');
  
  // Count completed steps
  const completedCount = babySteps.filter(step => step.completed).length;
  const progress = babySteps.length > 0 ? (completedCount / babySteps.length) * 100 : 0;
  
  // Format the date when the baby steps were created
  const formattedDate = ratings.length > 0 ? format(new Date(ratings[0].date), 'MMM dd, yyyy') : format(new Date(), 'MMM dd, yyyy');
  
  // Show confetti celebration effect
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#9370DB', '#7B68EE'],
        shapes: ['star', 'circle'],
        ticks: 200
      });
    } catch (error) {
      console.error("Error triggering confetti:", error);
    }
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
      const newStarsCount = starsEarned + 1;
      setStarsEarned(newStarsCount);
      localStorage.setItem('wellnessStars', newStarsCount.toString());
      
      toast({
        title: "🎉 Goal achieved! 🎉",
        description: "Amazing job! You've earned a star for your wellness bank!",
        duration: 5000,
      });
      
      // Show a second toast with more encouragement after a delay
      setTimeout(() => {
        toast({
          title: "⭐ Progress Milestone! ⭐",
          description: "You're one step closer to your wellness goals! Keep up the great work!",
          duration: 4000,
        });
      }, 1500);
    } else {
      // Decrease star count if unchecking
      if (starsEarned > 0) {
        const newStarsCount = starsEarned - 1;
        setStarsEarned(newStarsCount);
        localStorage.setItem('wellnessStars', newStarsCount.toString());
      }
      
      toast({
        title: "Step unmarked",
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
            <CardTitle className="text-2xl">Active Goal Tracker</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" /> 
              Last updated on {formattedDate}
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
              {babySteps.map((step) => {
                // Calculate how many times this goal was completed
                const completionCount = ratings
                  .filter(r => r.babyStep === step.babyStep && r.completed)
                  .length;
                
                return (
                  <div key={`${step.metricId}-${step.babyStep}`} className="flex items-start space-x-3 p-3 rounded-md bg-muted/30">
                    <Checkbox
                      checked={step.completed}
                      onCheckedChange={(checked) => 
                        handleToggle(step.metricId, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className={`font-medium pr-2 ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {step.babyStep}
                        </p>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <span className="sr-only">Open menu</span>
                              <Edit className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Check className="mr-2 h-4 w-4" />
                              <span>Mark as complete</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete goal</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-muted-foreground">
                          {step.metricName}
                        </p>
                        {completionCount > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Completed {completionCount} {completionCount === 1 ? 'time' : 'times'}
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
                );
              })}
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
