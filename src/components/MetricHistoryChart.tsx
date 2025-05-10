
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ReferenceLine } from 'recharts';
import { DailyWellnessEntry, WellnessMetric } from "@/types/wellness";
import { format } from "date-fns";

interface MetricHistoryChartProps {
  data: DailyWellnessEntry[];
  metric: WellnessMetric;
}

// Function to get the color based on the wellness score
const getScoreColor = (score: number): string => {
  if (score < 4.0) return "#F97316"; // Unhealthy - Orange
  if (score < 4.5) return "#4ECDC4"; // Healthy - Teal
  if (score < 4.7) return "#0EA5E9"; // Great - Blue (updated color)
  return "#8B5CF6"; // Amazing - Vivid Purple
};

// Custom dot component to render different colors based on score
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = getScoreColor(payload.score);
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4} 
      fill={color} 
      stroke="#fff" 
      strokeWidth={2} 
    />
  );
};

// Custom active dot component with larger size
const CustomActiveDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = getScoreColor(payload.score);
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={6} 
      fill={color} 
      stroke="#fff" 
      strokeWidth={2} 
    />
  );
};

const MetricHistoryChart = ({ data, metric }: MetricHistoryChartProps) => {
  // Extract date and score for the specific metric
  const chartData = data.map(entry => {
    const metricRating = entry.ratings.find(r => r.metricId === metric.id);
    const date = new Date(entry.timestamp || entry.date);
    const score = metricRating?.score || 0;
    
    return {
      date: entry.date,
      score: score,
      timestamp: entry.timestamp || entry.date,
      formattedDate: format(date, "MMM d"),
      formattedTime: format(date, "h:mm a"),
      category: score < 4.0 ? "Unhealthy" : 
               score < 4.5 ? "Healthy" : 
               score < 4.7 ? "Great" : "Amazing",
      dateObj: date // Add Date object for sorting
    };
  })
  // Sort data chronologically - oldest to newest
  .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
  .filter(item => item.score > 0); // Only include days with ratings

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
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-base md:text-lg">{metric.name} History</CardTitle>
        <CardDescription className="text-xs md:text-sm">Your {metric.name.toLowerCase()} progress over time</CardDescription>
      </CardHeader>
      <CardContent className="p-2 md:p-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="formattedDate"
                tick={{ fontSize: 10 }}
                angle={-30}
                textAnchor="end"
                height={50}
                tickMargin={8}
                scale="point"
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                domain={[0, 5]} 
                ticks={[0, 1, 2, 3, 4, 5]}
                width={25}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}`, `${metric.name} Score`]}
                labelFormatter={(_, data) => {
                  if (data && data.length > 0) {
                    const item = data[0].payload;
                    const date = new Date(item.timestamp);
                    const category = item.category;
                    const scoreValue = item.score;
                    
                    // Return formatted date and score category
                    return `${format(date, "MMM d, yyyy")}\nScore: ${scoreValue.toFixed(1)} (${category})`;
                  }
                  return "";
                }}
                contentStyle={{ fontSize: '10px' }}
              />

              {/* Color-coded areas for score categories */}
              <Area 
                dataKey="score"
                y1={4.7} 
                y2={5} 
                fill="#8B5CF6" 
                fillOpacity={0.2} 
                strokeOpacity={0}
                name="Amazing"
              />
              <Area 
                dataKey="score"
                y1={4.5} 
                y2={4.7} 
                fill="#0EA5E9" 
                fillOpacity={0.2} 
                strokeOpacity={0}
                name="Great"
              />
              <Area 
                dataKey="score"
                y1={4.0} 
                y2={4.5} 
                fill="#4ECDC4" 
                fillOpacity={0.2} 
                strokeOpacity={0}
                name="Healthy"
              />
              <Area 
                dataKey="score"
                y1={0} 
                y2={4.0} 
                fill="#F97316" 
                fillOpacity={0.2} 
                strokeOpacity={0}
                name="Unhealthy"
              />
              
              {/* Reference lines for category boundaries */}
              <ReferenceLine y={4.7} stroke="#8B5CF6" strokeDasharray="3 3" />
              <ReferenceLine y={4.5} stroke="#0EA5E9" strokeDasharray="3 3" />
              <ReferenceLine y={4.0} stroke="#4ECDC4" strokeDasharray="3 3" />
              
              {/* Line to show the actual score trend with color-based dots */}
              <Line
                type="monotone"
                dataKey="score"
                name={`${metric.name}`}
                stroke="#000"
                strokeWidth={2}
                dot={CustomDot}
                activeDot={CustomActiveDot}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Small legend for categories */}
        <div className="flex flex-wrap justify-center gap-2 mt-1 text-[9px]">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "#F97316" }}></div>
            <span>Unhealthy</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "#4ECDC4" }}></div>
            <span>Healthy</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "#0EA5E9" }}></div>
            <span>Great</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "#8B5CF6" }}></div>
            <span>Amazing</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricHistoryChart;
