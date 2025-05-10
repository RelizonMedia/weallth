import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ReferenceLine } from 'recharts';
import { DailyWellnessEntry, WellnessScoreCategory } from "@/types/wellness";
import { format } from "date-fns";

interface WellnessChartProps {
  data: DailyWellnessEntry[];
}

// Function to get the color based on the wellness score
const getScoreColor = (score: number): string => {
  if (score < 4.0) return "#F97316"; // Unhealthy - Orange
  if (score < 4.5) return "#4ECDC4"; // Healthy - Teal
  if (score < 4.7) return "#6C5DD3"; // Great - Purple
  return "#FFD700"; // Amazing - Yellow/Gold like a star (changed from purple)
};

// Custom dot component to render different colors based on score
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = getScoreColor(payload.score);
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={5} 
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
      r={7} 
      fill={color} 
      stroke="#fff" 
      strokeWidth={2} 
    />
  );
};

const WellnessChart = ({ data }: WellnessChartProps) => {
  // Extract date and score for the chart
  const chartData = data.map(entry => {
    const date = new Date(entry.timestamp || entry.date);
    return {
      date: entry.date,
      score: entry.overallScore,
      timestamp: entry.timestamp || entry.date,
      formattedDate: format(date, "MMM d"),
      formattedTime: format(date, "h:mm a"),
      category: entry.category
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
                    const category = item.category;
                    const scoreValue = item.score;
                    
                    // Return formatted date and score category
                    return `${format(date, "MMMM d, yyyy")} at ${format(date, "h:mm a")}
Score Category: ${category} (${scoreValue.toFixed(1)})`;
                  }
                  return "";
                }}
              />
              <Legend />
              
              {/* Color-coded areas for score categories */}
              <Area 
                dataKey="score"
                y1={4.7} 
                y2={5} 
                fill="#FFD700" 
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
              <ReferenceLine y={4.7} stroke="#FFD700" strokeDasharray="3 3" />
              <ReferenceLine y={4.5} stroke="#6C5DD3" strokeDasharray="3 3" />
              <ReferenceLine y={4.0} stroke="#4ECDC4" strokeDasharray="3 3" />
              
              {/* Line to show the actual score trend with color-based dots */}
              <Line
                type="monotone"
                dataKey="score"
                name="Wellness Score"
                stroke="#000"
                strokeWidth={2}
                dot={CustomDot}
                activeDot={CustomActiveDot}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend for score categories */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#F97316" }}></div>
            <span>&lt;4.0: Unhealthy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#4ECDC4" }}></div>
            <span>4.0-4.5: Healthy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#6C5DD3" }}></div>
            <span>4.5-4.7: Great</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: "#FFD700" }}></div>
            <span>4.7-5.0: Amazing</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessChart;
