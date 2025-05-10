
import { useState, useEffect } from "react";
import { Activity, Check, Sun, Moon, Heart, Users, TrendingUp, Wallet, Apple, Smile } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StarRating from "./StarRating";
import { Input } from "@/components/ui/input";
import { WellnessMetric, WellnessRating } from "@/types/wellness";
import { Progress } from "@/components/ui/progress";

interface WellnessMetricCardProps {
  metric: WellnessMetric;
  initialRating?: WellnessRating;
  onSave: (rating: WellnessRating) => void;
}

const iconMap: Record<string, React.ElementType> = {
  activity: Activity,
  sun: Sun,
  moon: Moon,
  heart: Heart,
  users: Users,
  compass: TrendingUp,
  "trending-up": TrendingUp,
  wallet: Wallet,
  apple: Apple,
  smile: Smile
};

const WellnessMetricCard = ({ metric, initialRating, onSave }: WellnessMetricCardProps) => {
  const [score, setScore] = useState(initialRating?.score || 0);
  const [babyStep, setBabyStep] = useState(initialRating?.babyStep || "");
  const [isSaved, setIsSaved] = useState(!!initialRating);
  
  const IconComponent = iconMap[metric.icon] || Activity;
  
  // Auto-save when score changes
  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (babyStep.trim()) {
      saveRating(newScore, babyStep);
    }
  };
  
  // Save rating when input loses focus if we have both score and baby step
  const handleInputBlur = () => {
    if (score > 0 && babyStep.trim()) {
      saveRating(score, babyStep);
    }
  };
  
  const saveRating = (currentScore: number, currentBabyStep: string) => {
    onSave({
      metricId: metric.id,
      score: currentScore,
      babyStep: currentBabyStep,
      completed: false,
      date: new Date().toISOString()
    });
    setIsSaved(true);
  };
  
  // If initial rating changes (e.g. when added from parent), update the saved state
  useEffect(() => {
    setIsSaved(!!initialRating);
  }, [initialRating]);
  
  const isComplete = score > 0 && babyStep.trim().length > 0;
  
  return (
    <Card className={`overflow-hidden transition-all ${isSaved ? "border-wellness-teal" : "hover:shadow-md"}`}>
      <CardHeader className={`pb-2 ${isSaved ? "bg-wellness-teal/20" : "bg-gradient-to-r from-wellness-teal/20 to-wellness-purple/20"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-wellness-purple/20 flex items-center justify-center">
              <IconComponent className="h-5 w-5 text-wellness-purple" />
            </div>
            <CardTitle className="text-lg font-medium">{metric.name}</CardTitle>
          </div>
          {isSaved && (
            <div className="bg-wellness-teal/30 text-wellness-teal rounded-full p-1">
              <Check className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">{metric.description}</p>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">How would you rate yourself today?</p>
            <StarRating value={score} onChange={handleScoreChange} />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">One baby step to improve:</p>
            <Input
              value={babyStep}
              onChange={(e) => setBabyStep(e.target.value)}
              onBlur={handleInputBlur}
              placeholder={`One small way to improve my ${metric.name.toLowerCase()}`}
              className={`flex-1 ${isSaved ? "border-wellness-teal/50" : ""}`}
            />
          </div>
          
          <div className="pt-2">
            <Progress 
              value={isComplete ? 100 : (score > 0 ? 50 : 0)} 
              className="h-1" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessMetricCard;
