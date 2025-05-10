
import { Check, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { WellnessRating } from "@/types/wellness";

interface StepItemProps {
  step: WellnessRating & { metricName: string };
  onToggle: (metricId: string, completed: boolean, stepName: string) => void;
}

const StepItem = ({ step, onToggle }: StepItemProps) => {
  return (
    <div className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
      <Checkbox
        checked={step.completed}
        onCheckedChange={(checked) => 
          onToggle(step.metricId, checked as boolean, step.babyStep)
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
  );
};

export default StepItem;
