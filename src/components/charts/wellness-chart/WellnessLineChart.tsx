
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CustomDot, CustomActiveDot } from "./ChartDots";
import ChartAreas from "./ChartAreas";
import ReferenceLines from "./ReferenceLines";

interface ChartData {
  date: string;
  score: number;
  timestamp: string;
  formattedDate: string;
  formattedTime: string;
  category: string;
  dateObj: Date;
}

interface WellnessLineChartProps {
  chartData: ChartData[];
}

const WellnessLineChart = ({ chartData }: WellnessLineChartProps) => {
  return (
    <ResponsiveContainer width="99%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 10,
          left: 0,
          bottom: 25,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          dataKey="formattedDate"
          tick={{ fontSize: 10 }}
          angle={-45}
          textAnchor="end"
          height={60}
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
          formatter={(value: number) => [`${value.toFixed(1)}`, 'Wellness Score']}
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
        <Legend wrapperStyle={{ fontSize: '10px' }} />
        
        {/* Color-coded areas for score categories */}
        <ChartAreas />
        
        {/* Reference lines for category boundaries */}
        <ReferenceLines />
        
        {/* Line to show the actual score trend with color-based dots */}
        <Line
          type="monotone"
          dataKey="score"
          name="Score"
          stroke="#000"
          strokeWidth={2}
          dot={CustomDot}
          activeDot={CustomActiveDot}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WellnessLineChart;
