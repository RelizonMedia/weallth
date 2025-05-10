
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWellnessTracking } from "@/hooks/useWellnessTracking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BabyStepsHistory from "@/components/BabyStepsHistory";
import WellnessChart from "@/components/WellnessChart";
import { Wallet, Star, Coins } from "lucide-react";

const WellnessBank = () => {
  const { historyData, isLoading } = useWellnessTracking();

  // Extract all ratings from history data
  const allRatings = historyData.flatMap(entry => entry.ratings);
  
  // Calculate total wellness points based on history
  const totalPoints = historyData.reduce((total, entry) => {
    return total + Math.round(entry.overallScore * 10); // Convert score to points
  }, 0);

  return (
    <Layout>
      <div className="container max-w-5xl py-8">
        <h1 className="text-3xl font-bold mb-2">My Wellness Bank</h1>
        <p className="text-muted-foreground mb-6">Track your wellness journey and achievements</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Wellness Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Coins className="h-6 w-6 mr-2 text-amber-500" />
                <span className="text-3xl font-bold">{totalPoints}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Baby Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Star className="h-6 w-6 mr-2 text-amber-500 fill-amber-500" />
                <span className="text-3xl font-bold">
                  {allRatings.filter(rating => rating.completed).length}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Days Tracked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Wallet className="h-6 w-6 mr-2 text-teal-500" />
                <span className="text-3xl font-bold">{historyData.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="progress" className="w-full mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="progress">Progress Chart</TabsTrigger>
            <TabsTrigger value="goals">Baby Steps History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <WellnessChart data={historyData} />
          </TabsContent>
          
          <TabsContent value="goals">
            <BabyStepsHistory steps={allRatings} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WellnessBank;
