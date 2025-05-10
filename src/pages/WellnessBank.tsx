
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWellnessTracking } from "@/hooks/useWellnessTracking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BabyStepsHistory from "@/components/BabyStepsHistory";
import WellnessChart from "@/components/WellnessChart";
import { Star, MessageCircle, Trophy, PartyPopper } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Wellness Stars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-amber-500" />
                <span className="text-3xl font-bold">{totalPoints}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Wellness Tips Shared</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-blue-500" />
                <span className="text-3xl font-bold">{tipsShared}</span>
                <Star className="h-4 w-4 ml-2 text-amber-500 fill-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Celebrations Given</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <PartyPopper className="h-6 w-6 mr-2 text-purple-500" />
                <span className="text-3xl font-bold">{celebrationsGiven}</span>
                <Star className="h-4 w-4 ml-2 text-amber-500 fill-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Baby Steps Completed</CardTitle>
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
        </div>

        <Tabs defaultValue="progress" className="w-full mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="progress">Progress Chart</TabsTrigger>
            <TabsTrigger value="goals">Baby Steps History</TabsTrigger>
            <TabsTrigger value="points">Points History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <WellnessChart data={historyData} />
          </TabsContent>
          
          <TabsContent value="goals">
            <BabyStepsHistory steps={allRatings} />
          </TabsContent>
          
          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle>Points History</CardTitle>
                <CardDescription>Track your wellness points over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Wellness Score</TableHead>
                      <TableHead>Points Earned</TableHead>
                      <TableHead className="text-right">Baby Steps Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyData.map((entry, index) => {
                      const pointsEarned = Math.round(entry.overallScore * 10);
                      const stepsCompleted = entry.ratings.filter(r => r.completed).length;
                      const entryDate = new Date(entry.timestamp || entry.date);
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {format(entryDate, "MMM d, yyyy")}
                            <div className="text-xs text-muted-foreground">
                              {format(entryDate, "h:mm a")}
                            </div>
                          </TableCell>
                          <TableCell>{entry.overallScore.toFixed(1)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                              <span>{pointsEarned}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <Star className="h-4 w-4 mr-1 text-amber-500 fill-amber-500" />
                              <span>{stepsCompleted}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WellnessBank;
