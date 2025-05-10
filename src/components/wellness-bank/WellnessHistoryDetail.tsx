
import { format } from "date-fns";
import { Calendar, Check, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyWellnessEntry } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";

interface WellnessHistoryDetailProps {
  historyData: DailyWellnessEntry[];
}

const WellnessHistoryDetail = ({
  historyData
}: WellnessHistoryDetailProps) => {
  // Helper function to ensure we have a valid date object for formatting
  const formatDateTime = (dateStr: string | undefined) => {
    if (!dateStr) return {
      date: "No date",
      time: "No time"
    };
    
    try {
      const date = new Date(dateStr);
      return {
        date: format(date, "MMM d, yyyy"),
        time: format(date, "h:mm a")
      };
    } catch (error) {
      console.error("Date formatting error:", error);
      return {
        date: "Invalid date",
        time: "Invalid time"
      };
    }
  };

  // If there's no history data, show an empty state
  if (historyData.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No wellness history data available yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mb-10">
      <h2 className="text-xl font-medium mb-4">Recent Wellness Activities</h2>
      
      {historyData.slice(0, 5).map((entry, index) => {
        const { date } = formatDateTime(entry.date);
        
        return (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {date}
                </CardTitle>
                <CardDescription>
                  Score: {entry.overallScore.toFixed(1)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {entry.ratings.map((rating, rIndex) => {
                  const metric = wellnessMetrics.find(m => m.id === rating.metricId);
                  return (
                    <div key={rIndex} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${rating.score >= 4 ? 'bg-green-500' : rating.score >= 3 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                        <span>{metric?.name || rating.metricId}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">{rating.score.toFixed(1)}</span>
                        {rating.completed && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WellnessHistoryDetail;
