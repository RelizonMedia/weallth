
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

  // Sort data by date (newest first) to ensure we're showing the most recent entry
  const sortedData = [...formattedData].sort((a, b) => {
    const dateA = new Date(a.timestamp || a.date);
    const dateB = new Date(b.timestamp || b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="space-y-3 w-full max-w-full overflow-hidden">
      {sortedData.length > 0 ? (
        <WellnessHistoryItem 
          key={0} 
          entry={sortedData[0]} 
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
