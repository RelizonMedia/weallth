
import { useState, useEffect } from "react";
import { DailyWellnessEntry } from "@/types/wellness";
import { CheckCircle2, ListTodo, Check, Circle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

interface BabyStepsFocusProps {
  babySteps: Array<{
    metricId: string;
    babyStep: string;
    score: number;
  }>;
}

const BabyStepsFocus = ({ babySteps }: BabyStepsFocusProps) => {
  const { toast } = useToast();
  const [trackingData, setTrackingData] = useState<Record<string, boolean[]>>({});
  
  // Generate dates for the next 7 days for tracking
  const generateTrackingDates = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  };
  
  const trackingDates = generateTrackingDates();
  
  // Initialize tracking data for steps if not already set
  useEffect(() => {
    if (babySteps.length > 0) {
      const initialData: Record<string, boolean[]> = {};
      babySteps.forEach((step) => {
        const stepKey = `${step.metricId}-${step.babyStep}`;
        if (!trackingData[stepKey]) {
          initialData[stepKey] = Array(7).fill(false);
        }
      });
      
      if (Object.keys(initialData).length > 0) {
        setTrackingData((prev) => ({ ...prev, ...initialData }));
      }
      
      // Try to load saved tracking data from localStorage
      const savedData = localStorage.getItem('babyStepsTracking');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setTrackingData(parsedData);
        } catch (e) {
          console.error("Error loading baby steps tracking data:", e);
        }
      }
    }
  }, [babySteps]);
  
  // Toggle step completion for a specific day
  const toggleStepCompletion = (stepKey: string, dayIndex: number) => {
    setTrackingData((prev) => {
      const newData = { ...prev };
      if (newData[stepKey]) {
        const updated = [...newData[stepKey]];
        updated[dayIndex] = !updated[dayIndex];
        newData[stepKey] = updated;
        
        // Save to localStorage
        localStorage.setItem('babyStepsTracking', JSON.stringify(newData));
        
        // Show toast notification
        const isCompleted = updated[dayIndex];
        toast({
          title: isCompleted ? "Step completed!" : "Step marked incomplete",
          description: isCompleted 
            ? "Great job on your wellness journey!" 
            : "You can complete this step later",
          duration: 3000,
        });
      }
      return newData;
    });
  };
  
  // Calculate completion rate for a step
  const getCompletionRate = (stepKey: string): number => {
    if (!trackingData[stepKey]) return 0;
    const completed = trackingData[stepKey].filter(day => day).length;
    return completed;
  };
  
  if (babySteps.length === 0) return null;
  
  return (
    <div className="mt-6">
      <Separator className="my-4" />
      <div className="flex items-center gap-2 mb-3">
        <ListTodo className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Key Baby Steps to Focus On</h3>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left font-medium text-sm text-muted-foreground px-4 py-2 w-1/3">Baby Step</th>
              {trackingDates.map((date, index) => (
                <th key={index} className="text-center font-medium text-xs text-muted-foreground px-2 py-2">
                  {format(date, 'EEE')}
                  <div className="text-[10px]">{format(date, 'dd/MM')}</div>
                </th>
              ))}
              <th className="text-center font-medium text-sm text-muted-foreground px-2 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {babySteps.slice(0, 3).map((step, index) => {
              const metric = wellnessMetrics.find(m => m.id === step.metricId);
              const metricName = metric?.name || "Wellness";
              const stepKey = `${step.metricId}-${step.babyStep}`;
              
              return (
                <tr key={index} className="border-b border-muted/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm">{step.babyStep}</p>
                      <p className="text-xs text-muted-foreground">
                        To improve your {metricName.toLowerCase()} ({step.score.toFixed(1)})
                      </p>
                    </div>
                  </td>
                  
                  {trackingData[stepKey]?.map((completed, dayIndex) => (
                    <td key={dayIndex} className="text-center px-2 py-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => toggleStepCompletion(stepKey, dayIndex)}
                      >
                        {completed ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/50" />
                        )}
                        <span className="sr-only">
                          {completed ? "Mark as incomplete" : "Mark as complete"}
                        </span>
                      </Button>
                    </td>
                  ))}
                  
                  <td className="text-center px-2 py-3">
                    <span className="inline-flex items-center justify-center h-8 w-8 bg-muted/30 rounded-full text-sm font-medium">
                      {getCompletionRate(stepKey)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BabyStepsFocus;
