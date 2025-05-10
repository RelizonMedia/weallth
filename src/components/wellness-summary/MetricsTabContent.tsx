
import { ListFilter } from "lucide-react";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { DailyWellnessEntry } from "@/types/wellness";
import MetricHistoryChart from "@/components/MetricHistoryChart";
import DateRangeSelector, { DateRangeType } from "./DateRangeSelector";
import { isWithinInterval } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsTabContentProps {
  data: DailyWellnessEntry[];
}

const MetricsTabContent = ({ data }: MetricsTabContentProps) => {
  const [filterMetric, setFilterMetric] = useState("all");
  const [filteredData, setFilteredData] = useState<DailyWellnessEntry[]>(data);
  
  // Handle date range filtering
  const handleDateRangeChange = (range: { 
    type: DateRangeType; 
    dateRange: { from: Date | undefined; to: Date | undefined } 
  }) => {
    if (range.type === "all") {
      // Show all data
      setFilteredData(data);
      return;
    }
    
    // Apply date filtering
    if (range.dateRange.from && range.dateRange.to) {
      const filtered = data.filter(entry => {
        const entryDate = new Date(entry.timestamp || entry.date);
        return isWithinInterval(entryDate, {
          start: range.dateRange.from as Date,
          end: range.dateRange.to as Date
        });
      });
      
      setFilteredData(filtered.length > 0 ? filtered : []);
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterMetric} onValueChange={setFilterMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                {wellnessMetrics.map(metric => (
                  <SelectItem key={metric.id} value={metric.id}>
                    {metric.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DateRangeSelector onRangeChange={handleDateRangeChange} />
        </div>
      </div>
      
      {filteredData.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {filterMetric === "all" 
            ? wellnessMetrics.map(metric => (
              <MetricHistoryChart 
                key={metric.id} 
                data={filteredData} 
                metric={metric}
              />
            ))
            : wellnessMetrics
              .filter(metric => metric.id === filterMetric)
              .map(metric => (
                <MetricHistoryChart 
                  key={metric.id} 
                  data={filteredData} 
                  metric={metric}
                />
              ))
          }
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No wellness data available for the selected period</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MetricsTabContent;
