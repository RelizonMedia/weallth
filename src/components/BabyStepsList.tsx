
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WellnessRating } from "@/types/wellness";
import { useState } from "react";
import StepsHeader from "./baby-steps/StepsHeader";
import StepProgressBar from "./baby-steps/StepProgressBar";
import StepsList from "./baby-steps/StepsList";
import CelebrationDialog from "./baby-steps/CelebrationDialog";
import { useCelebration } from "@/hooks/baby-steps/useCelebration";
import { useStarsManagement } from "@/hooks/baby-steps/useStarsManagement";
import { wellnessMetrics } from "@/data/wellnessMetrics";

interface BabyStepsListProps {
  ratings: WellnessRating[];
  onStepToggle: (metricId: string, completed: boolean) => void;
}

const BabyStepsList = ({ ratings, onStepToggle }: BabyStepsListProps) => {
  // Use custom hooks for celebration and stars management
  const { 
    showCelebration, 
    setShowCelebration, 
    celebratedStep,
    completionTime, 
    celebrate 
  } = useCelebration();
  
  const { starsEarned, addStar, removeStar } = useStarsManagement();
  
  // Add metric names to steps for metrics display
  const stepsWithNames = ratings.map(rating => {
    const metric = wellnessMetrics.find(m => m.id === rating.metricId);
    return {
      ...rating,
      metricName: metric?.name || ""
    };
  });
  
  const completedCount = stepsWithNames.filter(step => step.completed).length;
  
  const handleStepToggle = (metricId: string, completed: boolean, stepName: string) => {
    // Call the parent handler
    onStepToggle(metricId, completed);
    
    // Show celebration and increase star count if checked
    if (completed) {
      celebrate(stepName);
      addStar();
    } else {
      removeStar();
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <StepsHeader 
          completedCount={completedCount}
          totalCount={stepsWithNames.length}
          starsEarned={starsEarned}
        />
      </CardHeader>
      <CardContent>
        <StepProgressBar 
          completed={completedCount} 
          total={stepsWithNames.length} 
        />
        
        <StepsList 
          ratings={ratings} 
          onStepToggle={handleStepToggle} 
        />
        
        <CelebrationDialog
          open={showCelebration}
          onOpenChange={setShowCelebration}
          stepName={celebratedStep}
          completionTime={completionTime}
        />
      </CardContent>
    </Card>
  );
};

export default BabyStepsList;
