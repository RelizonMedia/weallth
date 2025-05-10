import Layout from "@/components/Layout";
import { useWellnessTracking } from "@/hooks/wellness/useWellnessTracking";
import WellnessStatsCards from "@/components/wellness-bank/WellnessStatsCards";
import WellnessTabs from "@/components/wellness-bank/WellnessTabs";
import WellnessHistoryDetail from "@/components/wellness-bank/WellnessHistoryDetail";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Star, MessageCircle, PartyPopper, Users, Award, Share } from "lucide-react";
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
  const friendsInvited = 5;
  const winsShared = 7;
  const communityMembers = 5;

  // Calculate combined total stars (personal + community)
  const totalPersonalStars = totalPoints;
  const totalCommunityStars = tipsShared + celebrationsGiven + friendsInvited + winsShared;
  const combinedTotalStars = totalPersonalStars + totalCommunityStars;

  // Calculate total daily entries
  const uniqueDates = new Set(allRatings.map(rating => rating.date));
  const totalDailyEntries = uniqueDates.size;

  // Calculate total completed baby steps
  const totalBabyStepsCompleted = allRatings.filter(rating => rating.completed).length;
  return <Layout>
      <div className="container max-w-5xl py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Wellness Bank</h1>
            <p className="text-muted-foreground">Track your wellness achievements and community impact</p>
          </div>
        </div>
        
        {/* Stars Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Personal Stars Card */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
            <div className="flex items-center mb-2">
              <Trophy className="h-5 w-5 mr-2 text-amber-600" />
              <h2 className="text-lg font-semibold text-amber-800">Personal Stars: {totalPersonalStars}</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center bg-white/60 rounded p-2">
                <Star className="h-4 w-4 mr-2 text-amber-500 fill-amber-500" />
                <div>
                  <div className="text-xs font-medium text-gray-600">Daily Tracking</div>
                  <div className="text-sm font-bold">{totalDailyEntries} stars</div>
                </div>
              </div>
              <div className="flex items-center bg-white/60 rounded p-2">
                <Star className="h-4 w-4 mr-2 text-amber-500 fill-amber-500" />
                <div>
                  <div className="text-xs font-medium text-gray-600">Baby Steps</div>
                  <div className="text-sm font-bold">{totalBabyStepsCompleted} stars</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Community Stars Card */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center mb-2">
              <Trophy className="h-5 w-5 mr-2 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-800">Community Stars: {totalCommunityStars}</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center bg-white/60 rounded p-2">
                <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                <div>
                  <div className="text-xs font-medium text-gray-600">Tips Shared</div>
                  <div className="text-sm font-bold">{tipsShared} stars</div>
                </div>
              </div>
              <div className="flex items-center bg-white/60 rounded p-2">
                <PartyPopper className="h-4 w-4 mr-2 text-purple-500" />
                <div>
                  <div className="text-xs font-medium text-gray-600">Celebrations</div>
                  <div className="text-sm font-bold">{celebrationsGiven} stars</div>
                </div>
              </div>
              <div className="flex items-center bg-white/60 rounded p-2">
                <Users className="h-4 w-4 mr-2 text-green-500" />
                <div>
                  <div className="text-xs font-medium text-gray-600">Friends Invited</div>
                  <div className="text-sm font-bold">{friendsInvited} stars</div>
                </div>
              </div>
              <div className="flex items-center bg-white/60 rounded p-2">
                <Share className="h-4 w-4 mr-2 text-indigo-500" />
                <div>
                  <div className="text-xs font-medium text-gray-600">Wins Shared</div>
                  <div className="text-sm font-bold">{winsShared} stars</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Combined Total Banner */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-amber-100 via-purple-100 to-blue-100 px-6 py-3 rounded-lg flex items-center">
            <Trophy className="h-6 w-6 mr-3 text-amber-600" />
            <div>
              <div className="text-sm font-medium text-gray-700">Total Wellness Stars</div>
              <div className="text-2xl font-bold">{combinedTotalStars}</div>
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