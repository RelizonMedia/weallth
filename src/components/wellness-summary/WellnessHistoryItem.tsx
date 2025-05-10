
import { Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { DailyWellnessEntry } from "@/types/wellness";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface WellnessHistoryItemProps {
  entry: DailyWellnessEntry & { 
    formattedDate: string;
    formattedTime: string;
  };
  compact?: boolean;
  onAddBabyStep?: (metricId: string, babyStep: string) => void;
}

// Function to get the color based on the wellness score
const getScoreColor = (score: number): string => {
  if (score < 4.0) return "bg-red-100 text-red-600 border-red-200"; // Unhealthy
  if (score < 4.5) return "bg-green-100 text-green-600 border-green-200"; // Healthy
  if (score < 4.7) return "bg-orange-100 text-orange-600 border-orange-200"; // Great
  return "bg-purple-100 text-purple-600 border-purple-200"; // Amazing
};

// Function to get the category name based on score
const getScoreCategory = (score: number): string => {
  if (score < 4.0) return "Unhealthy";
  if (score < 4.5) return "Healthy";
  if (score < 4.7) return "Great";
  return "Amazing";
};

// Function to get the text color based on the category
const getCategoryTextColor = (category: string): string => {
  switch (category) {
    case "Unhealthy": return "text-red-600";
    case "Healthy": return "text-green-600";
    case "Great": return "text-orange-600";
    case "Amazing": return "text-purple-600";
    default: return "text-wellness-teal";
  }
};

const WellnessHistoryItem = ({ entry, compact, onAddBabyStep }: WellnessHistoryItemProps) => {
  const { toast } = useToast();
  const [newBabySteps, setNewBabySteps] = useState<Record<string, string>>({});
  
  if (!entry) return null;
  
  // Get the appropriate text color for the category
  const categoryColor = getCategoryTextColor(entry.category);

  // Handle saving a new baby step
  const handleSaveBabyStep = (metricId: string) => {
    if (!newBabySteps[metricId] || newBabySteps[metricId].trim() === '') {
      toast({
        title: "Please enter a baby step",
        description: "The baby step cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (onAddBabyStep) {
      onAddBabyStep(metricId, newBabySteps[metricId]);
      
      toast({
        title: "Baby step added",
        description: "Your baby step has been added successfully"
      });
      
      // Clear this specific baby step input
      setNewBabySteps(prev => ({...prev, [metricId]: ''}));
    }
  };
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {entry.formattedDate} at {entry.formattedTime}
          </span>
        </div>
        <div className={`bg-opacity-10 px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}>
          {entry.category}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {wellnessMetrics.slice(0, compact ? 6 : wellnessMetrics.length).map(metric => {
          // Add null check to ensure entry.ratings exists
          const metricRating = entry.ratings && Array.isArray(entry.ratings) ? 
            entry.ratings.find(r => r && r.metricId === metric.id) : 
            undefined;
            
          const score = metricRating?.score || 0;
          const colorClasses = getScoreColor(score);
          const category = getScoreCategory(score);
          const hasBabyStep = metricRating?.babyStep && metricRating.babyStep.trim() !== '';
          
          return (
            <HoverCard key={metric.id}>
              <HoverCardTrigger asChild>
                <div className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${colorClasses}`}>
                  <span className="text-xs font-medium">{metric.name}</span>
                  <span className="text-2xl font-bold">{score}</span>
                  <span className="text-xs mt-1">{category}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">{metric.name}</h4>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                  
                  {hasBabyStep ? (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Your baby step:</p>
                      <div className="bg-muted p-2 rounded-md text-sm mt-1">
                        {metricRating?.babyStep}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground flex items-center">
                        <span className={`h-2 w-2 rounded-full ${metricRating?.completed ? 'bg-green-500' : 'bg-yellow-500'} mr-1`}></span>
                        <span>{metricRating?.completed ? 'Completed' : 'In progress'}</span>
                      </div>
                    </div>
                  ) : onAddBabyStep ? (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Add a baby step:</p>
                      <div className="flex mt-1 space-x-2">
                        <Input 
                          placeholder="What small step can you take?"
                          value={newBabySteps[metric.id] || ''}
                          onChange={(e) => setNewBabySteps(prev => ({...prev, [metric.id]: e.target.value}))}
                          className="text-sm"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button onClick={() => handleSaveBabyStep(metric.id)} size="sm" variant="secondary">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add this baby step</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs italic text-muted-foreground">No baby step defined for this metric.</p>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
    </div>
  );
};

export default WellnessHistoryItem;
