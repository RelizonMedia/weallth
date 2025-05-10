
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DailyWellnessEntry } from "@/types/wellness";
import WellnessChart from "@/components/WellnessChart";
import WellnessHistoryItem from "./WellnessHistoryItem";
import { format, isWithinInterval } from "date-fns";
import { useState } from "react";
import DateRangeSelector, { DateRangeType } from "./DateRangeSelector";

interface OverviewTabContentProps {
  data: DailyWellnessEntry[];
}

const OverviewTabContent = ({ data }: OverviewTabContentProps) => {
  const [filteredData, setFilteredData] = useState<DailyWellnessEntry[]>(data);
  
  // Handle date range filtering
  const handleDateRangeChange = (range: { 
    type: DateRangeType; 
    dateRange: { from: Date | undefined; to: Date | undefined } 
  }) => {
    if (range.type === "all") {
      // Show all data
      setFilteredData(data);
      return;
    }
    
    // Apply date filtering
    if (range.dateRange.from && range.dateRange.to) {
      const filtered = data.filter(entry => {
        const entryDate = new Date(entry.timestamp || entry.date);
        return isWithinInterval(entryDate, {
          start: range.dateRange.from as Date,
          end: range.dateRange.to as Date
        });
      });
      
      setFilteredData(filtered.length > 0 ? filtered : []);
    }
  };
  
  // Safely convert the data for the chart to include readable dates and times
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
    <div className="grid gap-6">
      {/* Date Range Filter */}
      <div className="flex justify-end mb-2">
        <DateRangeSelector onRangeChange={handleDateRangeChange} />
      </div>
      
      {filteredData.length > 0 ? (
        <>
          <WellnessChart data={filteredData} />

          <Card>
            <CardHeader>
              <CardTitle>Recent Wellness Trends</CardTitle>
              <CardDescription>Your latest wellness metrics with timestamps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataWithFormattedDates.slice(0, 3).map((entry, index) => (
                  <WellnessHistoryItem key={index} entry={entry} compact={true} />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No wellness data available for the selected period</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTabContent;
