
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DailyWellnessEntry } from "@/types/wellness";
import WellnessChart from "@/components/WellnessChart";
import WellnessHistoryItem from "./WellnessHistoryItem";
import { format } from "date-fns";

interface OverviewTabContentProps {
  data: DailyWellnessEntry[];
}

const OverviewTabContent = ({ data }: OverviewTabContentProps) => {
  // Format the data to include readable dates and times
  const formattedData = data.map(entry => {
    const timestamp = entry.timestamp || entry.date;
    const entryDate = timestamp ? new Date(timestamp) : new Date();
    
    return {
      ...entry,
      formattedDate: format(entryDate, "MMM d, yyyy"),
      formattedTime: format(entryDate, "h:mm a")
    };
  });

  const noDataMessage = (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">No wellness data available for the selected date range.</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6">
      {data.length > 0 ? <WellnessChart data={data} /> : noDataMessage}

      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Wellness Trends</CardTitle>
            <CardDescription>
              {/* Removed the text that described the number of entries */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formattedData.slice(0, 3).map((entry, index) => (
                <WellnessHistoryItem key={index} entry={entry} compact={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTabContent;
