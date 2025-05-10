
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyWellnessEntry, WellnessMetric } from "@/types/wellness";
import { format } from "date-fns";

interface MetricHistoryChartProps {
  data: DailyWellnessEntry[];
  metric: WellnessMetric;
}

const MetricHistoryChart = ({ data, metric }: MetricHistoryChartProps) => {
  // Extract date and score for the specific metric
  const chartData = data.map(entry => {
    const metricRating = entry.ratings.find(r => r.metricId === metric.id);
    const date = new Date(entry.timestamp || entry.date);
    return {
      date: entry.date,
      score: metricRating?.score || 0,
      timestamp: entry.timestamp || entry.date,
      formattedDate: format(date, "MMM d"),
      formattedTime: format(date, "h:mm a")
    };
  }).filter(item => item.score > 0); // Only include days with ratings

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{metric.name} History</CardTitle>
          <CardDescription>No historical data available yet</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground text-center">Track this metric for more days to see your progress over time</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{metric.name} History</CardTitle>
        <CardDescription>Your {metric.name.toLowerCase()} progress over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                domain={[0, 5]} 
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}`, `${metric.name} Score`]}
                labelFormatter={(_, data) => {
                  if (data && data.length > 0) {
                    const item = data[0].payload;
                    const date = new Date(item.timestamp);
                    return `${format(date, "MMMM d, yyyy")} at ${format(date, "h:mm a")}`;
                  }
                  return "";
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                name={`${metric.name} Score`}
                stroke="#6C5DD3"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricHistoryChart;
