
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { DailyWellnessEntry } from "@/types/wellness";
import WellnessChart from "./WellnessChart";
import WellnessScoreDisplay from "./WellnessScoreDisplay";
import MetricHistoryChart from "./MetricHistoryChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, ChartBar, ChartLine, Clock, ListFilter } from "lucide-react";
import { format } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WellnessSummaryProps {
  data: DailyWellnessEntry[];
  onClose: () => void;
}

const WellnessSummary = ({ data, onClose }: WellnessSummaryProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterMetric, setFilterMetric] = useState("all");
  
  // Get the latest entry for current wellness
  const latestEntry = data.length > 0 ? data[0] : null;
  const previousEntry = data.length > 1 ? data[1] : null;

  if (!latestEntry) {
    return (
      <div className="p-6 text-center">
        <p>No wellness data available. Start tracking to see your progress!</p>
        <Button onClick={onClose} className="mt-4">Start Tracking</Button>
      </div>
    );
  }

  // Convert the data for the chart to include readable dates and times
  const dataWithFormattedDates = data.map(entry => {
    const entryDate = new Date(entry.timestamp || entry.date);
    return {
      ...entry,
      formattedDate: format(entryDate, "MMM d, yyyy"),
      formattedTime: format(entryDate, "h:mm a"),
      displayDate: `${format(entryDate, "MMM d")} - ${format(entryDate, "h:mm a")}`
    };
  });

  return (
    <div className="space-y-6">
      <WellnessScoreDisplay
        score={latestEntry.overallScore}
        category={latestEntry.category}
        previousScore={previousEntry?.overallScore}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartLine className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            <span>Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-6">
            <WellnessChart data={data} />

            <Card>
              <CardHeader>
                <CardTitle>Recent Wellness Trends</CardTitle>
                <CardDescription>Your latest wellness metrics with timestamps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataWithFormattedDates.slice(0, 3).map((entry, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {entry.formattedDate} at {entry.formattedTime}
                          </span>
                        </div>
                        <div className="bg-wellness-teal/10 text-wellness-teal px-3 py-1 rounded-full text-sm font-medium">
                          {entry.category}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {wellnessMetrics.slice(0, 6).map(metric => {
                          const metricRating = entry.ratings.find(r => r.metricId === metric.id);
                          return (
                            <div key={metric.id} className="flex flex-col items-center p-3 border rounded-lg">
                              <span className="text-sm text-muted-foreground">{metric.name}</span>
                              <span className="text-2xl font-bold">{metricRating?.score || 0}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4">
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
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Complete Wellness History</CardTitle>
              <CardDescription>All your tracked entries with detailed timestamps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataWithFormattedDates.map((entry, index) => {
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          {entry.formattedDate}
                        </span>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {entry.formattedTime}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-wellness-teal/20 rounded-full flex items-center justify-center text-wellness-teal">
                          <span className="text-xl font-bold">{entry.overallScore.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-lg font-medium">{entry.category}</span>
                          <div className="grid grid-cols-5 gap-1 mt-2">
                            {entry.ratings.slice(0, 5).map(rating => {
                              const metric = wellnessMetrics.find(m => m.id === rating.metricId);
                              return (
                                <div key={rating.metricId} className="text-center" title={metric?.name}>
                                  <span className="text-xs text-muted-foreground">{metric?.name.substring(0, 3)}.</span>
                                  <div className="font-semibold">{rating.score}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {entry.ratings.map(rating => {
                            const metric = wellnessMetrics.find(m => m.id === rating.metricId);
                            return (
                              <div key={rating.metricId} className="p-2 bg-slate-50 rounded">
                                <div className="text-xs font-medium">{metric?.name}</div>
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-bold">{rating.score}</span>
                                  {rating.completed && (
                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                      Completed
                                    </span>
                                  )}
                                </div>
                                {rating.babyStep && (
                                  <div className="mt-1 text-xs text-muted-foreground truncate" title={rating.babyStep}>
                                    {rating.babyStep}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WellnessSummary;
