
import { DailyWellnessEntry } from "@/types/wellness";
import { CheckCircle2, ListTodo } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { wellnessMetrics } from "@/data/wellnessMetrics";

interface BabyStepsFocusProps {
  babySteps: Array<{
    metricId: string;
    babyStep: string;
    score: number;
  }>;
}

const BabyStepsFocus = ({ babySteps }: BabyStepsFocusProps) => {
  if (babySteps.length === 0) return null;
  
  return (
    <div className="mt-6">
      <Separator className="my-4" />
      <div className="flex items-center gap-2 mb-3">
        <ListTodo className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Key Baby Steps to Focus On</h3>
      </div>
      <div className="space-y-3">
        {babySteps.slice(0, 3).map((step, index) => {
          // Find the metric name using the wellness metrics data
          const metric = wellnessMetrics.find(m => m.id === step.metricId);
          const metricName = metric?.name || "Wellness";
          
          return (
            <div key={index} className="flex items-start gap-2 bg-muted/50 rounded-md p-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{step.babyStep}</p>
                <p className="text-sm text-muted-foreground">
                  To improve your {metricName.toLowerCase()} score ({step.score.toFixed(1)})
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BabyStepsFocus;
