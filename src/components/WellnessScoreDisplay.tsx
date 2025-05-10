
import {
  Trophy,
  TrendingUp,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WellnessScoreCategory } from "@/types/wellness";

interface WellnessScoreDisplayProps {
  score: number;
  category: WellnessScoreCategory;
  previousScore?: number;
}

const WellnessScoreDisplay = ({ 
  score, 
  category, 
  previousScore 
}: WellnessScoreDisplayProps) => {
  const getCategoryConfig = (category: WellnessScoreCategory) => {
    switch (category) {
      case "Amazing":
        return {
          icon: Trophy,
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
          description: "You're thriving! Excellent wellness balance."
        };
      case "Great":
        return {
          icon: TrendingUp,
          color: "text-green-500",
          bgColor: "bg-green-100",
          description: "You're doing very well in your wellness journey."
        };
      case "Healthy":
        return {
          icon: ThumbsUp,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          description: "You're maintaining a healthy wellness balance."
        };
      case "Unhealthy":
        return {
          icon: AlertTriangle,
          color: "text-red-500",
          bgColor: "bg-red-100",
          description: "There's room for improvement in your wellness."
        };
    }
  };
  
  const categoryConfig = getCategoryConfig(category);
  const Icon = categoryConfig.icon;
  const hasImproved = previousScore !== undefined && score > previousScore;
  const percentChange = previousScore 
    ? Math.abs(((score - previousScore) / previousScore) * 100).toFixed(1)
    : null;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Wellness Score</CardTitle>
        <CardDescription>Based on your 10-metric assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`h-12 w-12 rounded-full ${categoryConfig.bgColor} flex items-center justify-center`}>
              <Icon className={`h-6 w-6 ${categoryConfig.color}`} />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold mr-1">{score.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              </div>
              <p className="text-sm font-medium">{category}</p>
            </div>
          </div>
          
          {previousScore && (
            <div className={`px-2 py-1 rounded text-sm ${
              hasImproved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {hasImproved ? (
                <span className="flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{percentChange}%
                </span>
              ) : (
                <span>-{percentChange}%</span>
              )}
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          {categoryConfig.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default WellnessScoreDisplay;
