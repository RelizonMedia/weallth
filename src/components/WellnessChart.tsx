
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyWellnessEntry } from "@/types/wellness";
import { format } from "date-fns";

interface WellnessChartProps {
  data: DailyWellnessEntry[];
}

const WellnessChart = ({ data }: WellnessChartProps) => {
  // Extract date and score for the chart
  const chartData = data.map(entry => {
    const date = new Date(entry.timestamp || entry.date);
    return {
      date: entry.date,
      score: entry.overallScore,
      timestamp: entry.timestamp || entry.date,
      formattedDate: format(date, "MMM d"),
      formattedTime: format(date, "h:mm a")
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wellness Progress</CardTitle>
        <CardDescription>Track how your wellness has changed over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 25,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                domain={[0, 5]} 
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}`, 'Wellness Score']}
                labelFormatter={(_, data) => {
                  if (data && data.length > 0) {
                    const item = data[0].payload;
                    const date = new Date(item.timestamp);
                    return `${format(date, "MMMM d, yyyy")} at ${format(date, "h:mm a")}`;
                  }
                  return "";
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                name="Wellness Score"
                stroke="#4ECDC4"
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

export default WellnessChart;
