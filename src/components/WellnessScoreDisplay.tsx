
import {
  Trophy,
  TrendingUp,
  ThumbsUp,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WellnessScoreCategory } from "@/types/wellness";
import { format } from "date-fns";

interface WellnessScoreDisplayProps {
  score: number;
  category: WellnessScoreCategory;
  previousScore?: number;
  timestamp?: string;
}

const WellnessScoreDisplay = ({ 
  score, 
  category, 
  previousScore,
  timestamp
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
  
  // Add null check for score calculation
  const hasImproved = previousScore !== undefined && score > previousScore;
  
  // Safely calculate percentage change only if previousScore exists and is not zero
  const percentChange = previousScore && previousScore !== 0
    ? Math.abs(((score - previousScore) / previousScore) * 100).toFixed(1)
    : null;
  
  // Format the timestamp if available
  const formattedDateTime = timestamp 
    ? format(new Date(timestamp), "MMM d, yyyy 'at' h:mm a")
    : "No date recorded";
  
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
          
          {/* Only render this div if percentChange exists */}
          {percentChange && (
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

        {timestamp && (
          <div className="flex items-center mt-3 text-xs text-muted-foreground border-t pt-2">
            <CalendarClock className="h-3 w-3 mr-1" />
            <span>{formattedDateTime}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WellnessScoreDisplay;
