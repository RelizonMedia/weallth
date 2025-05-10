
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyWellnessEntry } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";
import { Clock } from "lucide-react";

interface WellnessHistoryViewProps {
  data: Array<DailyWellnessEntry & {
    formattedDate: string;
    formattedTime: string;
  }>;
}

const WellnessHistoryView = ({ data }: WellnessHistoryViewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Wellness History</CardTitle>
        <CardDescription>All your tracked entries with detailed timestamps</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((entry, index) => {
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
                    {entry.ratings && Array.isArray(entry.ratings) && entry.ratings.length > 0 ? (
                      <div className="grid grid-cols-5 gap-1 mt-2">
                        {entry.ratings.slice(0, 5).map(rating => {
                          const metric = wellnessMetrics.find(m => m.id === rating?.metricId);
                          return (
                            <div key={rating?.metricId} className="text-center" title={metric?.name}>
                              <span className="text-xs text-muted-foreground">{metric?.name?.substring(0, 3)}.</span>
                              <div className="font-semibold">{rating?.score}</div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-1">No detailed metrics available</div>
                    )}
                  </div>
                </div>
                
                {entry.ratings && Array.isArray(entry.ratings) && entry.ratings.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {entry.ratings.map(rating => {
                        if (!rating) return null;
                        const metric = wellnessMetrics.find(m => m.id === rating.metricId);
                        return (
                          <div key={rating.metricId} className="p-2 bg-slate-50 rounded">
                            <div className="text-xs font-medium">{metric?.name || 'Unknown'}</div>
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
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessHistoryView;
