
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { DailyWellnessEntry } from "@/types/wellness";

interface WellnessHistoryItemProps {
  entry: DailyWellnessEntry & { 
    formattedDate: string;
    formattedTime: string;
  };
  compact?: boolean;
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

const WellnessHistoryItem = ({ entry, compact }: WellnessHistoryItemProps) => {
  if (!entry) return null;
  
  // Get the appropriate text color for the category
  const categoryColor = getCategoryTextColor(entry.category);
  
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
          
          return (
            <div key={metric.id} className={`flex flex-col items-center p-3 rounded-lg border ${colorClasses}`}>
              <span className="text-xs font-medium">{metric.name}</span>
              <span className="text-2xl font-bold">{score}</span>
              <span className="text-xs mt-1">{category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WellnessHistoryItem;
