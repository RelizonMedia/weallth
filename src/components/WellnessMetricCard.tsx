
import { useState } from "react";
import { Activity, Check, Sun, Moon, Heart, Users, TrendingUp, Wallet, Apple, Smile } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StarRating from "./StarRating";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WellnessMetric, WellnessRating } from "@/types/wellness";

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
  
  const IconComponent = iconMap[metric.icon] || Activity;
  
  const handleSave = () => {
    onSave({
      metricId: metric.id,
      score,
      babyStep,
      completed: false,
      date: new Date().toISOString()
    });
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-wellness-teal/20 to-wellness-purple/20 pb-2">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-wellness-purple/20 flex items-center justify-center">
            <IconComponent className="h-5 w-5 text-wellness-purple" />
          </div>
          <CardTitle className="text-lg font-medium">{metric.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">{metric.description}</p>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">How would you rate yourself today?</p>
            <StarRating value={score} onChange={setScore} />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">One baby step to improve:</p>
            <div className="flex space-x-2">
              <Input
                value={babyStep}
                onChange={(e) => setBabyStep(e.target.value)}
                placeholder={`One small way to improve my ${metric.name.toLowerCase()}`}
                className="flex-1"
              />
              <Button onClick={handleSave} size="sm" className="shrink-0">
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessMetricCard;
