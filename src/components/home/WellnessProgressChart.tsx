
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import WellnessChart from "@/components/WellnessChart";
import { DailyWellnessEntry } from "@/types/wellness";

interface WellnessProgressChartProps {
  isLoading: boolean;
  chartData: DailyWellnessEntry[];
}

const WellnessProgressChart = ({ isLoading, chartData }: WellnessProgressChartProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-base md:text-lg">My Wellness Progress</CardTitle>
        <CardDescription className="text-xs md:text-sm">Track how your wellness has changed over time</CardDescription>
      </CardHeader>
      <CardContent className="p-2 md:p-4">
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Loading your wellness data...
          </div>
        ) : chartData.length > 0 ? (
          <WellnessChart data={chartData} />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="mb-4">No wellness data available yet.</p>
              <Button asChild size="sm">
                <Link to="/track?mode=new">Start Tracking</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WellnessProgressChart;
