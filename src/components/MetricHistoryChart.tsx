
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
  if (score < 4.7) return "#6C5DD3"; // Great - Purple
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
                    const category = item.category;
                    const scoreValue = item.score;
                    
                    // Return formatted date and score category
                    return `${format(date, "MMMM d, yyyy")} at ${format(date, "h:mm a")}
Score Category: ${category} (${scoreValue.toFixed(1)})`;
                  }
                  return "";
                }}
              />

              {/* Color-coded areas for score categories */}
              <Area 
                dataKey="score"
                y1={4.7} 
                y2={5} 
                fill="#8B5CF6" 
                fillOpacity={0.2} 
                strokeOpacity={0}
                name="Amazing (4.7-5.0)"
              />
              <Area 
                dataKey="score"
                y1={4.5} 
                y2={4.7} 
                fill="#6C5DD3" 
                fillOpacity={0.2} 
                strokeOpacity={0}
                name="Great (4.5-4.7)"
              />
              <Area 
                dataKey="score"
                y1={4.0} 
                y2={4.5} 
                fill="#4ECDC4" 
                fillOpacity={0.2} 
                strokeOpacity={0}
                name="Healthy (4.0-4.5)"
              />
              <Area 
                dataKey="score"
                y1={0} 
                y2={4.0} 
                fill="#F97316" 
                fillOpacity={0.2} 
                strokeOpacity={0}
                name="Unhealthy (<4.0)"
              />
              
              {/* Reference lines for category boundaries */}
              <ReferenceLine y={4.7} stroke="#8B5CF6" strokeDasharray="3 3" />
              <ReferenceLine y={4.5} stroke="#6C5DD3" strokeDasharray="3 3" />
              <ReferenceLine y={4.0} stroke="#4ECDC4" strokeDasharray="3 3" />
              
              {/* Line to show the actual score trend with color-based dots */}
              <Line
                type="monotone"
                dataKey="score"
                name={`${metric.name} Score`}
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
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "#F97316" }}></div>
            <span>&lt;4.0: Unhealthy</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "#4ECDC4" }}></div>
            <span>4.0-4.5: Healthy</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "#6C5DD3" }}></div>
            <span>4.5-4.7: Great</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "#8B5CF6" }}></div>
            <span>4.7-5.0: Amazing</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricHistoryChart;
