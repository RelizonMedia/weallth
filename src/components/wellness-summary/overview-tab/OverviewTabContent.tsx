
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DailyWellnessEntry } from "@/types/wellness";
import WellnessChart from "@/components/WellnessChart";
import { useBabyStepsMutation } from "./overview-tab/useBabyStepsMutation";
import WellnessHistorySection from "./overview-tab/WellnessHistorySection";
import BabyStepsFocus from "./overview-tab/BabyStepsFocus";
import EmptyStateCard from "./overview-tab/EmptyStateCard";
import BabyStepsHistoryChart from "./overview-tab/BabyStepsHistoryChart";

interface OverviewTabContentProps {
  data: DailyWellnessEntry[];
}

const OverviewTabContent = ({ data }: OverviewTabContentProps) => {
  // Ensure data is sorted by date (newest first)
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.timestamp || a.date);
    const dateB = new Date(b.timestamp || b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  const { localData, handleUpdateBabyStep } = useBabyStepsMutation(sortedData);
  
  // Extract baby steps from the most recent entry
  const getBabyStepsToFocus = () => {
    if (localData.length === 0 || !localData[0].ratings) return [];
    
    // Get all baby steps from the latest entry that aren't completed
    const babySteps = localData[0].ratings
      .filter(rating => rating.babyStep && rating.babyStep.trim() !== "" && !rating.completed)
      .map(rating => ({
        metricId: rating.metricId,
        babyStep: rating.babyStep,
        score: rating.score
      }));
    
    // Sort by score (lowest first as they need more focus)
    return babySteps.sort((a, b) => a.score - b.score);
  };
  
  const babyStepsToFocus = getBabyStepsToFocus();

  return (
    <div className="grid gap-6">
      {localData.length > 0 ? <WellnessChart data={localData} /> : <EmptyStateCard />}

      {localData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Wellness Trends</CardTitle>
            <CardDescription>
              Hover over metrics to see recommendations and add or edit baby steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WellnessHistorySection 
              data={localData}
              onUpdateBabyStep={handleUpdateBabyStep} 
            />
            
            {/* Baby Steps Focus Summary */}
            <BabyStepsFocus babySteps={babyStepsToFocus} />
          </CardContent>
        </Card>
      )}
      
      {/* Adding the Baby Steps History Chart after the trends card */}
      {localData.length > 0 && (
        <BabyStepsHistoryChart data={localData} />
      )}
    </div>
  );
};

export default OverviewTabContent;
