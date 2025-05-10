import Layout from "@/components/Layout";
import { useWellnessTracking } from "@/hooks/wellness/useWellnessTracking";
import WellnessStatsCards from "@/components/wellness-bank/WellnessStatsCards";
import WellnessTabs from "@/components/wellness-bank/WellnessTabs";
import WellnessHistoryDetail from "@/components/wellness-bank/WellnessHistoryDetail";
import { useToast } from "@/hooks/use-toast";
import { Trophy } from "lucide-react"; // Add missing Trophy icon import

const WellnessBank = () => {
  const {
    historyData,
    isLoading
  } = useWellnessTracking();
  const {
    toast
  } = useToast();

  // Extract all ratings from history data
  const allRatings = historyData.flatMap(entry => entry.ratings);

  // Calculate total wellness points based on history
  const totalPoints = historyData.reduce((total, entry) => {
    return total + Math.round(entry.overallScore * 10); // Convert score to points
  }, 0);

  // Community engagement metrics (simulated data - would be replaced with actual data)
  const tipsShared = 12;
  const celebrationsGiven = 8;
  const communityMembers = 5;
  return <Layout>
      <div className="container max-w-5xl py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">My Wellness Bank</h1>
            <p className="text-muted-foreground">Track your wellness achievements and community impact</p>
          </div>
          
          <div className="mt-2 md:mt-0 flex items-center gap-2">
            <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-amber-600" />
              <div>
                <div className="text-xs font-medium">Total Wellness Stars</div>
                <div className="text-lg font-bold">{totalPoints}</div>
              </div>
            </div>
          </div>
        </div>
        
        <WellnessStatsCards totalPoints={totalPoints} tipsShared={tipsShared} celebrationsGiven={celebrationsGiven} allRatings={allRatings} communityMembers={communityMembers} />

        <WellnessTabs historyData={historyData} allRatings={allRatings} />

        <WellnessHistoryDetail historyData={historyData} />
      </div>
    </Layout>;
};
export default WellnessBank;