
import { format } from "date-fns";
import { Calendar, Check, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyWellnessEntry } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";

interface WellnessHistoryDetailProps {
  historyData: DailyWellnessEntry[];
}

const WellnessHistoryDetail = ({ historyData }: WellnessHistoryDetailProps) => {
  // Helper function to ensure we have a valid date object for formatting
  const formatDateTime = (dateStr: string | undefined) => {
    if (!dateStr) return { date: "No date", time: "No time" };
    
    try {
      const date = new Date(dateStr);
      return {
        date: format(date, "MMM d, yyyy"),
        time: format(date, "h:mm a")
      };
    } catch (error) {
      console.error("Date formatting error:", error);
      return { date: "Invalid date", time: "Invalid time" };
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Complete Wellness History</CardTitle>
        <CardDescription>Browse all your wellness tracking entries with detailed information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {historyData.map((entry, index) => {
            const entryDatetime = formatDateTime(entry.timestamp || entry.date);
            
            return (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {entryDatetime.date}
                    </span>
                    <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                    <span className="text-sm text-muted-foreground">
                      {entryDatetime.time}
                    </span>
                  </div>
                  <div className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                    {entry.category} - {entry.overallScore.toFixed(1)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {entry.ratings.map(rating => {
                    const metric = wellnessMetrics.find(m => m.id === rating.metricId);
                    return (
                      <div key={rating.metricId} className="p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground">{metric?.name}</div>
                        <div className="text-xl font-bold">{rating.score.toFixed(1)}</div>
                        {rating.babyStep && (
                          <div className="mt-2">
                            <div className="text-xs text-muted-foreground">Baby Step:</div>
                            <div className="text-sm truncate" title={rating.babyStep}>
                              {rating.babyStep}
                            </div>
                            {rating.completed && (
                              <div className="mt-1 inline-flex items-center text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                                <Check className="h-3 w-3 mr-1" />
                                Completed
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {historyData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No wellness data available yet. Start tracking to see your history.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessHistoryDetail;
