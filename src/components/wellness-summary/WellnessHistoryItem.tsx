
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

const WellnessHistoryItem = ({ entry, compact }: WellnessHistoryItemProps) => {
  if (!entry) return null;
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {entry.formattedDate} at {entry.formattedTime}
          </span>
        </div>
        <div className="bg-wellness-teal/10 text-wellness-teal px-3 py-1 rounded-full text-sm font-medium">
          {entry.category}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {wellnessMetrics.slice(0, compact ? 6 : wellnessMetrics.length).map(metric => {
          // Add null check to ensure entry.ratings exists
          const metricRating = entry.ratings && Array.isArray(entry.ratings) ? 
            entry.ratings.find(r => r && r.metricId === metric.id) : 
            undefined;
            
          return (
            <div key={metric.id} className="flex flex-col items-center p-3 border rounded-lg">
              <span className="text-sm text-muted-foreground">{metric.name}</span>
              <span className="text-2xl font-bold">{metricRating?.score || 0}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WellnessHistoryItem;
