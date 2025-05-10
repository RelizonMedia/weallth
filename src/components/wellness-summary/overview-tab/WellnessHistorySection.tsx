
import { DailyWellnessEntry } from "@/types/wellness";
import WellnessHistoryItem from "../WellnessHistoryItem";
import { format } from "date-fns";
import EmptyStateCard from "./EmptyStateCard";

interface WellnessHistorySectionProps {
  data: DailyWellnessEntry[];
  onUpdateBabyStep: (metricId: string, babyStep: string) => void;
}

const WellnessHistorySection = ({ data, onUpdateBabyStep }: WellnessHistorySectionProps) => {
  // Format the data to include readable dates and times
  const formattedData = data.map(entry => {
    const timestamp = entry.timestamp || entry.date;
    const entryDate = timestamp ? new Date(timestamp) : new Date();
    
    return {
      ...entry,
      formattedDate: format(entryDate, "MMM d, yyyy"),
      formattedTime: format(entryDate, "h:mm a")
    };
  });

  return (
    <div className="space-y-4">
      {formattedData.length > 0 ? (
        <WellnessHistoryItem 
          key={0} 
          entry={formattedData[0]} 
          compact={false} 
          onUpdateBabyStep={onUpdateBabyStep}
        />
      ) : (
        <EmptyStateCard />
      )}
    </div>
  );
};

export default WellnessHistorySection;
