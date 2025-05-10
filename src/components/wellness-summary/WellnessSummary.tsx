
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
import DateRangeSelector, { DateRange } from "./DateRangeSelector";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WellnessSummaryProps {
  data: DailyWellnessEntry[];
  onClose: () => void;
}

const WellnessSummary = ({ data, onClose }: WellnessSummaryProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  
  // Get the latest entry for current wellness
  const latestEntry = data.length > 0 ? data[0] : null;
  const previousEntry = data.length > 1 ? data[1] : null;

  // Filter data based on selected date range
  const filteredData = data.filter(entry => {
    if (!dateRange.from && !dateRange.to) return true; // All time
    
    const entryDate = new Date(entry.timestamp || entry.date);
    
    if (dateRange.from && dateRange.to) {
      return entryDate >= dateRange.from && entryDate <= dateRange.to;
    }
    
    if (dateRange.from) {
      return entryDate >= dateRange.from;
    }
    
    if (dateRange.to) {
      return entryDate <= dateRange.to;
    }
    
    return true;
  });

  if (!latestEntry) {
    return (
      <div className="p-3 text-center">
        <p>No wellness data available. Start tracking to see your progress!</p>
        <Button onClick={onClose} className="mt-3">Start Tracking</Button>
      </div>
    );
  }

  // Convert filtered data to include readable dates and times
  const dataWithFormattedDates = filteredData.map(entry => {
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
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-3 overflow-hidden w-full max-w-full pr-2">
        <div className="flex flex-col gap-3">
          <WellnessScoreDisplay
            score={latestEntry.overallScore}
            category={latestEntry.category}
            previousScore={previousEntry?.overallScore}
            timestamp={latestEntry.timestamp}
          />
          <DateRangeSelector onRangeChange={setDateRange} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-1 text-xs md:text-sm">
              <ChartLine className="h-3 w-3 md:h-4 md:w-4" />
              <span className="truncate">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-1 text-xs md:text-sm">
              <ChartBar className="h-3 w-3 md:h-4 md:w-4" />
              <span className="truncate">Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1 text-xs md:text-sm">
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
              <span className="truncate">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-3">
            <OverviewTabContent data={filteredData} />
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-3">
            <MetricsTabContent data={filteredData} />
          </TabsContent>
          
          <TabsContent value="history" className="mt-3">
            <WellnessHistoryView data={dataWithFormattedDates} />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default WellnessSummary;
