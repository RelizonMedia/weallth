
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyWellnessEntry } from "@/types/wellness";
import { format } from "date-fns";

interface WellnessChartProps {
  data: DailyWellnessEntry[];
}

const WellnessChart = ({ data }: WellnessChartProps) => {
  // Extract date and score for the chart
  const chartData = data.map(entry => ({
    date: entry.date,
    score: entry.overallScore
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wellness Progress</CardTitle>
        <CardDescription>Your wellness journey over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
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
                formatter={(value: number) => [`${value.toFixed(1)}`, 'Wellness Score']}
                labelFormatter={(label) => {
                  const date = new Date(label as string);
                  return format(date, "MMM d, yyyy h:mm a");
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
