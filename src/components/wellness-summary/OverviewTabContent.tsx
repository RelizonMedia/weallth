
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DailyWellnessEntry, WellnessRating } from "@/types/wellness";
import WellnessChart from "@/components/WellnessChart";
import WellnessHistoryItem from "./WellnessHistoryItem";
import { format } from "date-fns";
import { useWellnessTracking } from "@/hooks/wellness/useWellnessTracking";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface OverviewTabContentProps {
  data: DailyWellnessEntry[];
}

const OverviewTabContent = ({ data }: OverviewTabContentProps) => {
  const { handleToggleBabyStep } = useWellnessTracking();
  const { toast } = useToast();
  const [localData, setLocalData] = useState<DailyWellnessEntry[]>(data);
  
  // Format the data to include readable dates and times
  const formattedData = localData.map(entry => {
    const timestamp = entry.timestamp || entry.date;
    const entryDate = timestamp ? new Date(timestamp) : new Date();
    
    return {
      ...entry,
      formattedDate: format(entryDate, "MMM d, yyyy"),
      formattedTime: format(entryDate, "h:mm a")
    };
  });

  // Handle adding a baby step
  const handleAddBabyStep = (metricId: string, babyStep: string) => {
    // Update local data first
    const updatedData = localData.map(entry => {
      if (entry === localData[0]) {  // Update only the latest entry
        const updatedRatings = [...entry.ratings];
        const ratingIndex = updatedRatings.findIndex(r => r.metricId === metricId);
        
        if (ratingIndex >= 0) {
          // Update existing rating
          updatedRatings[ratingIndex] = {
            ...updatedRatings[ratingIndex],
            babyStep: babyStep,
            completed: false
          };
        } else {
          // Create new rating if none exists
          updatedRatings.push({
            metricId,
            babyStep,
            completed: false,
            score: 0,
            date: entry.date
          });
        }
        
        return {
          ...entry,
          ratings: updatedRatings
        };
      }
      return entry;
    });
    
    setLocalData(updatedData);
    
    // Also update in the backend through the hook
    if (updatedData[0]?.ratings) {
      const rating = updatedData[0].ratings.find(r => r.metricId === metricId);
      if (rating) {
        handleToggleBabyStep(metricId, false);
      }
    }
  };

  const noDataMessage = (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">No wellness data available for the selected date range.</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6">
      {data.length > 0 ? <WellnessChart data={data} /> : noDataMessage}

      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Wellness Trends</CardTitle>
            <CardDescription>
              {/* Removed the text that described the number of entries */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formattedData.slice(0, 3).map((entry, index) => (
                <WellnessHistoryItem 
                  key={index} 
                  entry={entry} 
                  compact={true} 
                  onAddBabyStep={index === 0 ? handleAddBabyStep : undefined}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTabContent;
