
import { WellnessRating } from "@/types/wellness";
import StepItem from "./StepItem";
import { wellnessMetrics } from "@/data/wellnessMetrics";

interface StepsListProps {
  ratings: WellnessRating[];
  onStepToggle: (metricId: string, completed: boolean, stepName: string) => void;
}

const StepsList = ({ ratings, onStepToggle }: StepsListProps) => {
  // Add metric names to steps for display
  const stepsWithNames = ratings.map(rating => {
    const metric = wellnessMetrics.find(m => m.id === rating.metricId);
    return {
      ...rating,
      metricName: metric?.name || ""
    };
  });
  
  return (
    <div className="space-y-3 max-h-[320px] overflow-y-auto">
      {stepsWithNames.map((step) => (
        <StepItem 
          key={`${step.metricId}-${step.babyStep}`} 
          step={step} 
          onToggle={onStepToggle} 
        />
      ))}
    </div>
  );
};

export default StepsList;
