
import { format } from "date-fns";
import { DailyWellnessEntry } from "@/types/wellness";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import WellnessLineChart from "./charts/wellness-chart/WellnessLineChart";
import ScoreLegend from "./charts/wellness-chart/ScoreLegend";

interface WellnessChartProps {
  data: DailyWellnessEntry[];
}

const WellnessChart = ({ data }: WellnessChartProps) => {
  // Make a local copy of the data to avoid modifying the original array
  const entriesWithDates = [...data].map(entry => {
    const date = new Date(entry.timestamp || entry.date);
    return {
      ...entry,
      date: entry.date,
      score: entry.overallScore,
      timestamp: entry.timestamp || entry.date,
      formattedDate: format(date, "MMM d"),
      formattedTime: format(date, "h:mm a"),
      category: entry.category,
      dateObj: date // Add actual Date object for sorting
    };
  });
  
  // Sort data chronologically - oldest to newest
  const chartData = entriesWithDates.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-base md:text-lg">Wellness Progress</CardTitle>
        <CardDescription className="text-xs md:text-sm">Track how your wellness has changed over time</CardDescription>
      </CardHeader>
      <CardContent className="p-2 md:p-4">
        <div className="h-[300px] max-w-full overflow-hidden">
          <WellnessLineChart chartData={chartData} />
        </div>
        
        {/* Small legend for categories */}
        <ScoreLegend />
      </CardContent>
    </Card>
  );
};

export default WellnessChart;
