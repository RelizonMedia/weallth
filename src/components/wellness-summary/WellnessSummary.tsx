
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyWellnessEntry } from "@/types/wellness";
import WellnessScoreDisplay from "@/components/WellnessScoreDisplay";
import { Calendar, ChartBar, ChartLine } from "lucide-react";
import { format } from "date-fns";
import OverviewTabContent from "./OverviewTabContent";
import MetricsTabContent from "./MetricsTabContent";
import WellnessHistoryView from "./WellnessHistoryView";

interface WellnessSummaryProps {
  data: DailyWellnessEntry[];
  onClose: () => void;
}

const WellnessSummary = ({ data, onClose }: WellnessSummaryProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get the latest entry for current wellness
  const latestEntry = data.length > 0 ? data[0] : null;
  const previousEntry = data.length > 1 ? data[1] : null;

  if (!latestEntry) {
    return (
      <div className="p-6 text-center">
        <p>No wellness data available. Start tracking to see your progress!</p>
        <Button onClick={onClose} className="mt-4">Start Tracking</Button>
      </div>
    );
  }

  // Safely convert the data for the chart to include readable dates and times
  const dataWithFormattedDates = data.map(entry => {
    // Ensure entry has valid timestamp or date
    const timestamp = entry.timestamp || entry.date;
    const entryDate = timestamp ? new Date(timestamp) : new Date();
    
    return {
      ...entry,
      formattedDate: format(entryDate, "MMM d, yyyy"),
      formattedTime: format(entryDate, "h:mm a"),
      displayDate: `${format(entryDate, "MMM d")} - ${format(entryDate, "h:mm a")}`
    };
  });

  return (
    <div className="space-y-6">
      <WellnessScoreDisplay
        score={latestEntry.overallScore}
        category={latestEntry.category}
        previousScore={previousEntry?.overallScore}
        timestamp={latestEntry.timestamp} // Pass the timestamp
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartLine className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            <span>Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <OverviewTabContent data={data} />
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4">
          <MetricsTabContent data={data} />
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <WellnessHistoryView data={dataWithFormattedDates} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WellnessSummary;
