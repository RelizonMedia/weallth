
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWellnessTracking } from "@/hooks/useWellnessTracking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BabyStepsHistory from "@/components/BabyStepsHistory";
import WellnessChart from "@/components/WellnessChart";
import { Star, MessageCircle, Trophy, PartyPopper, Calendar, Clock, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useState } from "react";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import MetricHistoryChart from "@/components/MetricHistoryChart";

const WellnessBank = () => {
  const { historyData, isLoading } = useWellnessTracking();
  const [selectedMetric, setSelectedMetric] = useState(wellnessMetrics[0]?.id || "");

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
            <TabsTrigger value="metrics">Metric History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Progress Over Time</CardTitle>
                <CardDescription>Track your wellness journey with detailed timestamps</CardDescription>
              </CardHeader>
              <CardContent>
                <WellnessChart data={historyData} />
              </CardContent>
            </Card>
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

          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Metric History</CardTitle>
                <CardDescription>See how each wellness metric has changed over time</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Metric selector */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {historyData.length} entries tracked
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last updated: {historyData.length > 0 ? format(new Date(historyData[0].timestamp || historyData[0].date), "MMM d, yyyy h:mm a") : "No data"}
                    </span>
                  </div>
                </div>
                
                {/* Metric selector */}
                <div className="mb-6">
                  <select 
                    className="w-full bg-background border border-input p-2 rounded-md"
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                  >
                    {wellnessMetrics.map(metric => (
                      <option key={metric.id} value={metric.id}>
                        {metric.name} History
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Metric chart */}
                <div className="mt-6">
                  {selectedMetric && (
                    <MetricHistoryChart 
                      data={historyData} 
                      metric={wellnessMetrics.find(m => m.id === selectedMetric) || wellnessMetrics[0]} 
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Complete Wellness History</CardTitle>
            <CardDescription>Browse all your wellness tracking entries with detailed information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {historyData.map((entry, index) => {
                const entryDate = new Date(entry.timestamp || entry.date);
                
                return (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {format(entryDate, "MMMM d, yyyy")}
                        </span>
                        <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                        <span className="text-sm text-muted-foreground">
                          {format(entryDate, "h:mm a")}
                        </span>
                      </div>
                      <div className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                        {entry.category} - {entry.overallScore.toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {entry.ratings.map(rating => {
                        const metric = wellnessMetrics.find(m => m.id === rating.metricId);
                        return (
                          <div key={rating.metricId} className="p-3 border rounded-lg">
                            <div className="text-sm text-muted-foreground">{metric?.name}</div>
                            <div className="text-xl font-bold">{rating.score.toFixed(1)}</div>
                            {rating.babyStep && (
                              <div className="mt-2">
                                <div className="text-xs text-muted-foreground">Baby Step:</div>
                                <div className="text-sm truncate" title={rating.babyStep}>
                                  {rating.babyStep}
                                </div>
                                {rating.completed && (
                                  <div className="mt-1 inline-flex items-center text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                    <Check className="h-3 w-3 mr-1" />
                                    Completed
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {historyData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No wellness data available yet. Start tracking to see your history.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WellnessBank;
