
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface WellnessTabsProps {
  historyData: DailyWellnessEntry[];
  allRatings: WellnessRating[];
}

const WellnessTabs = ({
  historyData,
  allRatings
}: WellnessTabsProps) => {
  const [selectedMetric, setSelectedMetric] = useState(wellnessMetrics[0]?.id || "");
  
  return (
    <Tabs defaultValue="points" className="w-full mb-4 overflow-hidden max-w-full">
      <TabsList className="mb-3 overflow-x-auto flex whitespace-nowrap w-full max-w-full">
        <TabsTrigger value="points" className="text-xs md:text-sm">Wellness Bank History</TabsTrigger>
        <TabsTrigger value="progress" className="text-xs md:text-sm">Progress Chart</TabsTrigger>
        <TabsTrigger value="goals" className="text-xs md:text-sm">Baby Steps History</TabsTrigger>
        <TabsTrigger value="metrics" className="text-xs md:text-sm">Detailed Metrics</TabsTrigger>
      </TabsList>
      
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <TabsContent value="points">
          <PointsHistory historyData={historyData} />
        </TabsContent>
        
        <TabsContent value="progress">
          <Card className="overflow-hidden">
            <CardHeader className="p-2">
              <CardTitle className="text-base md:text-lg">Wellness Progress Over Time</CardTitle>
              <CardDescription className="text-xs md:text-sm">Track your wellness journey</CardDescription>
            </CardHeader>
            <CardContent className="p-2 overflow-hidden">
              <WellnessChart data={historyData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals">
          <BabyStepsHistory steps={allRatings} />
        </TabsContent>

        <TabsContent value="metrics">
          <Card className="overflow-hidden">
            <CardHeader className="p-2">
              <CardTitle className="text-base md:text-lg">Detailed Metric History</CardTitle>
              <CardDescription className="text-xs md:text-sm">See how each metric has changed over time</CardDescription>
            </CardHeader>
            <CardContent className="p-2 overflow-hidden">
              {/* Metric selector */}
              <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {historyData.length} entries tracked
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    Last updated: {historyData.length > 0 ? format(new Date(historyData[0].timestamp || historyData[0].date), "MMM d") : "No data"}
                  </span>
                </div>
              </div>
              
              {/* Metric selector */}
              <div className="mb-2">
                <select className="w-full bg-background border border-input p-1 rounded-md text-xs md:text-sm" value={selectedMetric} onChange={e => setSelectedMetric(e.target.value)}>
                  {wellnessMetrics.map(metric => <option key={metric.id} value={metric.id}>
                      {metric.name} History
                    </option>)}
                </select>
              </div>
              
              {/* Metric chart */}
              <div className="mt-2 overflow-hidden">
                {selectedMetric && <MetricHistoryChart data={historyData} metric={wellnessMetrics.find(m => m.id === selectedMetric) || wellnessMetrics[0]} />}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
};

export default WellnessTabs;
