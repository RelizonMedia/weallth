
import { useState, useEffect } from "react";
import { Activity, Check, Sun, Moon, Heart, Users, TrendingUp, Wallet, Apple, Smile, History } from "lucide-react";
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
  smile: Smile,
  history: History
};

const WellnessMetricCard = ({ metric, initialRating, onSave }: WellnessMetricCardProps) => {
  const [score, setScore] = useState(initialRating?.score || 0);
  const [babyStep, setBabyStep] = useState(initialRating?.babyStep || "");
  const [isSaved, setIsSaved] = useState(!!initialRating);
  
  const IconComponent = iconMap[metric.icon] || Activity;
  
  // Auto-save when score changes
  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    // Save even without baby step text
    saveRating(newScore, babyStep);
  };
  
  // Save rating when input loses focus
  const handleInputBlur = () => {
    if (score > 0) {
      saveRating(score, babyStep);
    }
  };

  // Handle input change
  const handleBabyStepChange = (value: string) => {
    setBabyStep(value);
    if (score > 0) {
      // Save whenever there's a score, even with empty baby step
      saveRating(score, value);
    }
  };
  
  const saveRating = (currentScore: number, currentBabyStep: string) => {
    // Make sure we create a properly formed rating object
    const rating = {
      metricId: metric.id,
      score: currentScore,
      babyStep: currentBabyStep, // Can be empty string
      completed: false, // Baby steps start as not completed
      date: new Date().toISOString()
    };
    
    // Pass the rating up to the parent component
    onSave(rating);
    setIsSaved(true);
  };
  
  // If initial rating changes, update local state
  useEffect(() => {
    if (initialRating) {
      setScore(initialRating.score);
      setBabyStep(initialRating.babyStep);
      setIsSaved(true);
    }
  }, [initialRating]);
  
  // Change to only require score to be complete
  const isComplete = score > 0;
  
  return (
    <Card className={`overflow-hidden transition-all ${isSaved ? "border-wellness-teal" : "hover:shadow-md"}`}>
      <CardHeader className={`p-3 ${isSaved ? "bg-wellness-teal/20" : "bg-gradient-to-r from-wellness-teal/20 to-wellness-purple/20"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-wellness-purple/20 flex items-center justify-center">
              <IconComponent className="h-4 w-4 text-wellness-purple" />
            </div>
            <CardTitle className="text-sm md:text-base font-medium truncate max-w-[140px] sm:max-w-none">{metric.name}</CardTitle>
          </div>
          {isSaved && (
            <div className="bg-wellness-teal/30 text-wellness-teal rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">{metric.description}</p>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs md:text-sm font-medium mb-1">Rate (1-5 stars)</p>
            <StarRating value={score} onChange={handleScoreChange} />
          </div>
          
          <div>
            <p className="text-xs md:text-sm font-medium mb-1">Baby step (optional):</p>
            <Input
              value={babyStep}
              onChange={(e) => handleBabyStepChange(e.target.value)}
              onBlur={handleInputBlur}
              placeholder="Small improvement step"
              className={`text-xs md:text-sm flex-1 ${isSaved ? "border-wellness-teal/50" : ""}`}
            />
          </div>
          
          <div className="pt-2">
            <Progress 
              value={isComplete ? 100 : 0} 
              className="h-1" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessMetricCard;
