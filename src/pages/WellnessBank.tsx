
import Layout from "@/components/Layout";
import { useWellnessTracking } from "@/hooks/wellness/useWellnessTracking";
import WellnessStatsCards from "@/components/wellness-bank/WellnessStatsCards";
import WellnessTabs from "@/components/wellness-bank/WellnessTabs";
import WellnessHistoryDetail from "@/components/wellness-bank/WellnessHistoryDetail";
import { Clock } from "lucide-react";
import { format } from "date-fns";

const WellnessBank = () => {
  const { historyData, isLoading } = useWellnessTracking();

  // Extract all ratings from history data
  const allRatings = historyData.flatMap(entry => entry.ratings);
  
  // Calculate total wellness points based on history
  const totalPoints = historyData.reduce((total, entry) => {
    return total + Math.round(entry.overallScore * 10); // Convert score to points
  }, 0);
  
  // Community engagement metrics (simulated data - would be replaced with actual data)
  const tipsShared = 12;
  const celebrationsGiven = 8;

  return (
    <Layout>
      <div className="container max-w-5xl py-8">
        <h1 className="text-3xl font-bold mb-2">My Wellness Bank</h1>
        <p className="text-muted-foreground mb-6">Track your wellness journey and achievements</p>
        
        <WellnessStatsCards
          totalPoints={totalPoints}
          tipsShared={tipsShared}
          celebrationsGiven={celebrationsGiven}
          allRatings={allRatings}
        />

        <WellnessTabs 
          historyData={historyData}
          allRatings={allRatings}
        />

        <WellnessHistoryDetail 
          historyData={historyData}
        />
      </div>
    </Layout>
  );
};

export default WellnessBank;
