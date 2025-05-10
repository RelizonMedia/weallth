
import { WellnessRating } from "@/types/wellness";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Check, Star, Calendar, Clock } from "lucide-react";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { Badge } from "@/components/ui/badge";

interface BabyStepsHistoryProps {
  steps: WellnessRating[];
}

const BabyStepsHistory = ({ steps }: BabyStepsHistoryProps) => {
  // Filter only steps that have a baby step
  const allStepsWithContent = steps
    .filter(step => step.babyStep.trim() !== '')
    .map(step => {
      const metric = wellnessMetrics.find(m => m.id === step.metricId);
      return {
        ...step,
        metricName: metric?.name || ""
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const completedSteps = allStepsWithContent.filter(step => step.completed);

  // Group steps by date and then by baby step content to show completion frequency
  const stepsByDate: Record<string, Record<string, {
    step: typeof allStepsWithContent[0],
    count: number,
    dates: string[],
    isActive: boolean
  }>> = {};

  // First, group all steps by date
  allStepsWithContent.forEach(step => {
    const date = step.date;
    if (!stepsByDate[date]) {
      stepsByDate[date] = {};
    }
    
    const stepKey = `${step.metricId}-${step.babyStep}`;
    
    if (!stepsByDate[date][stepKey]) {
      stepsByDate[date][stepKey] = {
        step,
        count: step.completed ? 1 : 0,
        dates: [date],
        isActive: !step.completed
      };
    } else if (step.completed) {
      stepsByDate[date][stepKey].count += 1;
    }
  });

  if (allStepsWithContent.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Baby Steps History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            You haven't created any baby steps yet.
          </p>
        </CardContent>
      </Card>
    );
  }

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
          {Object.entries(stepsByDate).map(([date, stepsMap]) => (
            <div key={date} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(date), 'MMMM d, yyyy')}
              </h3>
              <div className="space-y-2">
                {Object.values(stepsMap).map((entry, index) => {
                  const { step, count } = entry;
                  const isCompleted = step.completed;
                  
                  return (
                    <div 
                      key={`${step.metricId}-${index}`} 
                      className={`flex items-center space-x-3 p-2 rounded-md ${isCompleted ? 'bg-green-50' : 'bg-amber-50'}`}
                    >
                      <div className={`rounded-full p-1 ${isCompleted ? 'bg-green-500' : 'bg-amber-500'}`}>
                        {isCompleted ? (
                          <Check className="h-3 w-3 text-white" />
                        ) : (
                          <Clock className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{step.babyStep}</p>
                          {count > 1 && (
                            <Badge variant="secondary" className="ml-2">
                              Completed {count}x
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <p className="text-xs text-muted-foreground">{step.metricName}</p>
                          <p className="text-xs text-muted-foreground">
                            {step.timestamp ? format(new Date(step.timestamp), 'h:mm a') : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BabyStepsHistory;
