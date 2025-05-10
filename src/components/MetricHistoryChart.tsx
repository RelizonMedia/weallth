
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
    return {
      date: entry.date,
      score: metricRating?.score || 0,
      fullDate: entry.date // Store full date for tooltip
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
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                domain={[0, 5]} 
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}`, `${metric.name} Score`]}
                labelFormatter={(label) => {
                  const date = new Date(label as string);
                  return format(date, "MMM d, yyyy h:mm a");
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                name={`${metric.name} Score`}
                stroke="#6C5DD3"
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2 }}
                activeDot={{ r: 7, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricHistoryChart;
