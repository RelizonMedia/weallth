
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { DailyWellnessEntry } from "@/types/wellness";
import { useToast } from "@/hooks/use-toast";
import WellnessHistoryHeader from "./WellnessHistoryHeader";
import MetricScoreCard from "./MetricScoreCard";

interface WellnessHistoryItemProps {
  entry: DailyWellnessEntry & { 
    formattedDate: string;
    formattedTime: string;
  };
  compact?: boolean;
  onUpdateBabyStep?: (metricId: string, babyStep: string) => void;
}

const WellnessHistoryItem = ({ entry, compact, onUpdateBabyStep }: WellnessHistoryItemProps) => {
  const { toast } = useToast();
  
  if (!entry) return null;
  
  // Handle baby step updates with toast notification
  const handleUpdateBabyStep = (metricId: string, babyStep: string) => {
    if (onUpdateBabyStep) {
      onUpdateBabyStep(metricId, babyStep);
      
      toast({
        title: "Baby step updated",
        description: "Your baby step has been saved successfully",
      });
    }
  };
  
  return (
    <div className="border rounded-lg p-4">
      <WellnessHistoryHeader 
        formattedDate={entry.formattedDate} 
        formattedTime={entry.formattedTime} 
        category={entry.category} 
      />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wellnessMetrics.map(metric => {
          // Add null check to ensure entry.ratings exists
          const metricRating = entry.ratings && Array.isArray(entry.ratings) ? 
            entry.ratings.find(r => r && r.metricId === metric.id) : 
            undefined;
          
          if (!metricRating) return null;
          
          return (
            <MetricScoreCard
              key={metric.id}
              metricRating={metricRating}
              onUpdateBabyStep={handleUpdateBabyStep}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WellnessHistoryItem;
