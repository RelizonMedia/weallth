
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DailyWellnessEntry } from "@/types/wellness";
import WellnessChart from "@/components/WellnessChart";
import WellnessHistoryItem from "./WellnessHistoryItem";
import { format } from "date-fns";

interface OverviewTabContentProps {
  data: DailyWellnessEntry[];
}

const OverviewTabContent = ({ data }: OverviewTabContentProps) => {
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
    <div className="grid gap-6">
      <WellnessChart data={data} />

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
    </div>
  );
};

export default OverviewTabContent;
