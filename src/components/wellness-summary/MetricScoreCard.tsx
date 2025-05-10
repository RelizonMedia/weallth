
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { WellnessRating } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { Plus, Pencil } from "lucide-react";
import { getScoreColor, getScoreCategory, getRecommendation } from "@/utils/wellnessScoreUtils";

interface MetricScoreCardProps {
  metricRating: WellnessRating;
  onUpdateBabyStep?: (metricId: string, babyStep: string) => void;
}

const MetricScoreCard = ({ metricRating, onUpdateBabyStep }: MetricScoreCardProps) => {
  const [editingBabyStep, setEditingBabyStep] = useState(false);
  const [babyStepInput, setBabyStepInput] = useState(metricRating.babyStep || "");
  
  const metric = wellnessMetrics.find(m => m.id === metricRating.metricId);
  if (!metric) return null;
  
  const score = metricRating.score;
  const colorClasses = getScoreColor(score);
  const category = getScoreCategory(score);
  const recommendation = getRecommendation(metric.id, metric.name, score);
  const hasBabyStep = metricRating.babyStep && metricRating.babyStep.trim() !== "";
  
  const handleSaveBabyStep = () => {
    if (babyStepInput.trim() && onUpdateBabyStep) {
      onUpdateBabyStep(metricRating.metricId, babyStepInput.trim());
      setEditingBabyStep(false);
    }
  };
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${colorClasses}`}>
          <span className="text-xs font-medium">{metric.name}</span>
          <span className="text-2xl font-bold">{score.toFixed(1)}</span>
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
            {editingBabyStep ? (
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
                    onClick={() => setEditingBabyStep(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSaveBabyStep}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {hasBabyStep ? (
                  <div className="flex justify-between items-center">
                    <p className="text-sm">{metricRating.babyStep}</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="ml-2"
                      onClick={() => {
                        setEditingBabyStep(true);
                        setBabyStepInput(metricRating.babyStep || "");
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
                        setEditingBabyStep(true);
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
};

export default MetricScoreCard;
