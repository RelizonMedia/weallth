
import { WellnessRating } from "@/types/wellness";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Check, Star } from "lucide-react";
import { wellnessMetrics } from "@/data/wellnessMetrics";

interface BabyStepsHistoryProps {
  steps: WellnessRating[];
}

const BabyStepsHistory = ({ steps }: BabyStepsHistoryProps) => {
  // Filter only steps that have been completed and have a baby step
  const completedSteps = steps
    .filter(step => step.completed && step.babyStep.trim() !== '')
    .map(step => {
      const metric = wellnessMetrics.find(m => m.id === step.metricId);
      return {
        ...step,
        metricName: metric?.name || ""
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (completedSteps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Baby Steps History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            You haven't completed any baby steps yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group steps by date
  const stepsByDate: Record<string, typeof completedSteps> = {};
  completedSteps.forEach(step => {
    if (!stepsByDate[step.date]) {
      stepsByDate[step.date] = [];
    }
    stepsByDate[step.date].push(step);
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Baby Steps History</CardTitle>
          <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
            <span className="text-amber-700 font-medium">{completedSteps.length}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(stepsByDate).map(([date, steps]) => (
            <div key={date} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <h3 className="font-medium text-sm mb-2">
                {format(new Date(date), 'MMMM d, yyyy')}
              </h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div 
                    key={`${step.metricId}-${index}`} 
                    className="flex items-center space-x-3 p-2 rounded-md bg-green-50"
                  >
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{step.babyStep}</p>
                      <p className="text-xs text-muted-foreground">{step.metricName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BabyStepsHistory;
