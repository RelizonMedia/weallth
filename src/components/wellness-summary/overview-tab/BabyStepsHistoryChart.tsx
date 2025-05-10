
import { DailyWellnessEntry } from "@/types/wellness";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface BabyStepsHistoryChartProps {
  data: DailyWellnessEntry[];
}

interface ChartDataPoint {
  date: string;
  completed: number;
  created: number;
  formattedDate: string;
}

const BabyStepsHistoryChart = ({ data }: BabyStepsHistoryChartProps) => {
  // Process data for the chart
  const chartData: ChartDataPoint[] = data.map(entry => {
    const completedSteps = entry.ratings.filter(rating => 
      rating.babyStep && rating.babyStep.trim() !== '' && rating.completed
    ).length;
    
    const createdSteps = entry.ratings.filter(rating => 
      rating.babyStep && rating.babyStep.trim() !== ''
    ).length;
    
    const entryDate = new Date(entry.timestamp || entry.date);
    
    return {
      date: entry.date,
      completed: completedSteps,
      created: createdSteps,
      formattedDate: format(entryDate, 'MMM d')
    };
  });
  
  // Sort data by date (oldest to newest)
  const sortedData = [...chartData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Baby Steps History</CardTitle>
        <CardDescription>Track how many baby steps you've created and completed over time</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={sortedData}
                margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
              >
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    return [value, name === "created" ? "Steps Created" : "Steps Completed"];
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', marginTop: '10px' }}
                  payload={[
                    { value: 'Steps Created', type: 'square', color: '#a3e635' },
                    { value: 'Steps Completed', type: 'square', color: '#34d399' }
                  ]}
                />
                <Bar 
                  dataKey="created" 
                  name="Steps Created" 
                  fill="#a3e635" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="completed" 
                  name="Steps Completed" 
                  fill="#34d399" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[200px] text-muted-foreground">
            No data available for baby steps history
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BabyStepsHistoryChart;
