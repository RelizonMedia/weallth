
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { DailyWellnessEntry } from "@/types/wellness";
import WellnessChart from "./WellnessChart";
import WellnessScoreDisplay from "./WellnessScoreDisplay";
import MetricHistoryChart from "./MetricHistoryChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChartBar, ChartLine, Clock } from "lucide-react";

interface WellnessSummaryProps {
  data: DailyWellnessEntry[];
  onClose: () => void;
}

const WellnessSummary = ({ data, onClose }: WellnessSummaryProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Get the latest entry for current wellness
  const latestEntry = data.length > 0 ? data[data.length - 1] : null;
  const previousEntry = data.length > 1 ? data[data.length - 2] : null;

  if (!latestEntry) {
    return (
      <div className="p-6 text-center">
        <p>No wellness data available. Start tracking to see your progress!</p>
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Wellness Summary</h2>
        <Button onClick={onClose} variant="outline">
          Close Summary
        </Button>
      </div>

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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wellnessMetrics.slice(0, 6).map(metric => {
                      const metricRating = latestEntry.ratings.find(r => r.metricId === metric.id);
                      return (
                        <div key={metric.id} className="flex flex-col items-center p-3 border rounded-lg">
                          <span className="text-sm text-muted-foreground">{metric.name}</span>
                          <span className="text-2xl font-bold">{metricRating?.score || 0}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {wellnessMetrics.map(metric => (
              <MetricHistoryChart 
                key={metric.id} 
                data={data} 
                metric={metric}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Wellness History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.slice().reverse().map((entry, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {new Date(entry.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WellnessSummary;
