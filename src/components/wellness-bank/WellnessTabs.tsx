
import { useState } from "react";
import { Calendar, ChartBar, ChartLine, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyWellnessEntry, WellnessRating } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BabyStepsHistory from "@/components/BabyStepsHistory";
import WellnessChart from "@/components/WellnessChart";
import MetricHistoryChart from "@/components/MetricHistoryChart";
import PointsHistory from "./PointsHistory";

interface WellnessTabsProps {
  historyData: DailyWellnessEntry[];
  allRatings: WellnessRating[];
}

const WellnessTabs = ({ historyData, allRatings }: WellnessTabsProps) => {
  const [selectedMetric, setSelectedMetric] = useState(wellnessMetrics[0]?.id || "");

  return (
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
        <PointsHistory historyData={historyData} />
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
  );
};

export default WellnessTabs;
