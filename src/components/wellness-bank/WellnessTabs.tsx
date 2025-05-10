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
  return <Tabs defaultValue="points" className="w-full mb-4 overflow-hidden max-w-full">
      
      
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
          
        </TabsContent>
      </ScrollArea>
    </Tabs>;
};
export default WellnessTabs;