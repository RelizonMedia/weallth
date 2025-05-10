
import { DailyWellnessEntry } from "@/types/wellness";
import WellnessScoreDisplay from "@/components/WellnessScoreDisplay";
import BabyStepsList from "@/components/BabyStepsList";
import WellnessStreak from "@/components/WellnessStreak";

interface WellnessSummarySectionProps {
  todayEntry: DailyWellnessEntry;
  previousEntry: DailyWellnessEntry | null;
  streakDays: number;
  onStepToggle: (metricId: string, completed: boolean) => void;
}

const WellnessSummarySection = ({ 
  todayEntry, 
  previousEntry, 
  streakDays,
  onStepToggle 
}: WellnessSummarySectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <WellnessScoreDisplay 
        score={todayEntry.overallScore} 
        category={todayEntry.category} 
        previousScore={previousEntry?.overallScore} 
        timestamp={todayEntry.timestamp || todayEntry.date} 
      />
      {todayEntry && todayEntry.ratings && (
        <BabyStepsList 
          ratings={todayEntry.ratings} 
          onStepToggle={onStepToggle} 
        />
      )}
      <WellnessStreak days={streakDays} />
    </div>
  );
};

export default WellnessSummarySection;
