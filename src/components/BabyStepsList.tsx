
import { Check, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { WellnessRating } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";

interface BabyStepsListProps {
  ratings: WellnessRating[];
  onStepToggle: (metricId: string, completed: boolean) => void;
}

const BabyStepsList = ({ ratings, onStepToggle }: BabyStepsListProps) => {
  const stepsWithNames = ratings.map(rating => {
    const metric = wellnessMetrics.find(m => m.id === rating.metricId);
    return {
      ...rating,
      metricName: metric?.name || ""
    };
  });
  
  const completedCount = stepsWithNames.filter(step => step.completed).length;
  const progress = (completedCount / stepsWithNames.length) * 100;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Today's Baby Steps</CardTitle>
            <CardDescription>Small steps toward better wellness</CardDescription>
          </div>
          <div className="text-sm font-medium">
            {completedCount}/{stepsWithNames.length}
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
            <div key={step.metricId} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <Checkbox
                checked={step.completed}
                onCheckedChange={(checked) => 
                  onStepToggle(step.metricId, checked as boolean)
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
