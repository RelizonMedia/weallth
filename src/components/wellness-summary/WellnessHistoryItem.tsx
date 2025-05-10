
import { Clock, Plus, Pencil } from "lucide-react";
import { format } from "date-fns";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { DailyWellnessEntry, WellnessRating } from "@/types/wellness";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface WellnessHistoryItemProps {
  entry: DailyWellnessEntry & { 
    formattedDate: string;
    formattedTime: string;
  };
  compact?: boolean;
  onUpdateBabyStep?: (metricId: string, babyStep: string) => void;
}

// Function to get the color based on the wellness score
const getScoreColor = (score: number): string => {
  if (score < 4.0) return "bg-red-100 text-red-600 border-red-200"; // Unhealthy
  if (score < 4.5) return "bg-green-100 text-green-600 border-green-200"; // Healthy
  if (score < 4.7) return "bg-blue-100 text-blue-600 border-blue-200"; // Great - updated to blue
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
    case "Great": return "text-blue-600"; // Updated to blue
    case "Amazing": return "text-purple-600";
    default: return "text-wellness-teal";
  }
};

// Function to generate recommendations based on metric and score
const getRecommendation = (metricId: string, score: number): string => {
  const metric = wellnessMetrics.find(m => m.id === metricId);
  
  if (score >= 4.7) {
    return `Keep up your amazing work with ${metric?.name.toLowerCase()}!`;
  } else if (score >= 4.5) {
    return `You're doing great with ${metric?.name.toLowerCase()}. Small improvements could make it amazing.`;
  } else if (score >= 4.0) {
    return `Your ${metric?.name.toLowerCase()} is healthy. Consider focusing on consistency.`;
  } else {
    return `This area needs attention. Small daily habits can improve your ${metric?.name.toLowerCase()}.`;
  }
};

const WellnessHistoryItem = ({ entry, compact, onUpdateBabyStep }: WellnessHistoryItemProps) => {
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const [babyStepInput, setBabyStepInput] = useState("");
  const { toast } = useToast();
  
  if (!entry) return null;
  
  // Get the appropriate text color for the category
  const categoryColor = getCategoryTextColor(entry.category);
  
  const handleAddOrUpdateBabyStep = (metricId: string) => {
    if (babyStepInput.trim() && onUpdateBabyStep) {
      onUpdateBabyStep(metricId, babyStepInput.trim());
      setEditingMetricId(null);
      setBabyStepInput("");
      toast({
        title: "Baby step updated",
        description: "Your baby step has been saved successfully",
      });
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wellnessMetrics.map(metric => {
          // Add null check to ensure entry.ratings exists
          const metricRating = entry.ratings && Array.isArray(entry.ratings) ? 
            entry.ratings.find(r => r && r.metricId === metric.id) : 
            undefined;
            
          const score = metricRating?.score || 0;
          const colorClasses = getScoreColor(score);
          const category = getScoreCategory(score);
          const recommendation = getRecommendation(metric.id, score);
          const hasBabyStep = metricRating?.babyStep && metricRating.babyStep.trim() !== "";
          
          return (
            <HoverCard key={metric.id}>
              <HoverCardTrigger asChild>
                <div className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${colorClasses}`}>
                  <span className="text-xs font-medium">{metric.name}</span>
                  <span className="text-2xl font-bold">{score}</span>
                  <span className="text-xs mt-1">{category}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">{metric.name}</h4>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm">Recommendation:</h5>
                    <p className="text-sm">{recommendation}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm">Baby Step:</h5>
                    {editingMetricId === metric.id ? (
                      <div className="flex flex-col space-y-2">
                        <Input 
                          placeholder="Enter a small step to improve"
                          value={babyStepInput}
                          onChange={(e) => setBabyStepInput(e.target.value)}
                          className="text-sm"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingMetricId(null)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleAddOrUpdateBabyStep(metric.id)}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {hasBabyStep ? (
                          <div className="flex justify-between items-center">
                            <p className="text-sm">{metricRating?.babyStep}</p>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="ml-2"
                              onClick={() => {
                                setEditingMetricId(metric.id);
                                setBabyStepInput(metricRating?.babyStep || "");
                              }}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs flex items-center"
                              onClick={() => {
                                setEditingMetricId(metric.id);
                                setBabyStepInput("");
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add baby step
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
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
