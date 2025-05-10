
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

interface MetricsTabContentProps {
  data: DailyWellnessEntry[];
}

const MetricsTabContent = ({ data }: MetricsTabContentProps) => {
  const [filterMetric, setFilterMetric] = useState("all");
  
  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Metric Details</h3>
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
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {filterMetric === "all" 
          ? wellnessMetrics.map(metric => (
            <MetricHistoryChart 
              key={metric.id} 
              data={data} 
              metric={metric}
            />
          ))
          : wellnessMetrics
            .filter(metric => metric.id === filterMetric)
            .map(metric => (
              <MetricHistoryChart 
                key={metric.id} 
                data={data} 
                metric={metric}
              />
            ))
        }
      </div>
    </div>
  );
};

export default MetricsTabContent;
