
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DailyWellnessEntry } from "@/types/wellness";
import WellnessChart from "@/components/WellnessChart";
import WellnessHistoryItem from "./WellnessHistoryItem";
import { format } from "date-fns";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ListTodo } from "lucide-react";
import { wellnessMetrics } from "@/data/wellnessMetrics";

interface OverviewTabContentProps {
  data: DailyWellnessEntry[];
}

const OverviewTabContent = ({ data }: OverviewTabContentProps) => {
  const [localData, setLocalData] = useState<DailyWellnessEntry[]>(data);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Format the data to include readable dates and times
  const formattedData = localData.map(entry => {
    const timestamp = entry.timestamp || entry.date;
    const entryDate = timestamp ? new Date(timestamp) : new Date();
    
    return {
      ...entry,
      formattedDate: format(entryDate, "MMM d, yyyy"),
      formattedTime: format(entryDate, "h:mm a")
    };
  });

  // Mutation for updating baby steps
  const updateBabyStepMutation = useMutation({
    mutationFn: async ({
      entryDate,
      metricId,
      babyStep
    }: {
      entryDate: string;
      metricId: string;
      babyStep: string;
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      // First get the entry id
      const { data: entryData, error: entryError } = await supabase
        .from('wellness_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', entryDate)
        .maybeSingle();
      
      if (entryError) throw entryError;
      if (!entryData) throw new Error("Entry not found");
      
      // Find the rating for this metric
      const { data: ratingData, error: ratingError } = await supabase
        .from('wellness_ratings')
        .select('id')
        .eq('entry_id', entryData.id)
        .eq('metric_id', metricId)
        .maybeSingle();
      
      if (ratingError) throw ratingError;
      
      if (ratingData) {
        // Update existing rating
        const { error } = await supabase
          .from('wellness_ratings')
          .update({ 
            baby_step: babyStep,
            updated_at: new Date().toISOString()
          })
          .eq('id', ratingData.id);
        
        if (error) throw error;
      } else {
        // Create a new rating if none exists
        const { error } = await supabase
          .from('wellness_ratings')
          .insert({
            entry_id: entryData.id,
            metric_id: metricId,
            score: 3.0, // Default score
            baby_step: babyStep,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
      
      return { entryDate, metricId, babyStep };
    },
    onSuccess: (data) => {
      // Update local state
      setLocalData(prev => 
        prev.map(entry => {
          if (entry.date === data.entryDate) {
            return {
              ...entry,
              ratings: entry.ratings.map(rating => 
                rating.metricId === data.metricId 
                  ? { ...rating, babyStep: data.babyStep }
                  : rating
              )
            };
          }
          return entry;
        })
      );
      
      // Show success message
      toast({
        title: "Success!",
        description: "Baby step updated successfully",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['wellnessEntries'] as unknown as never });
    },
    onError: (error) => {
      console.error('Error updating baby step:', error);
      toast({
        title: "Error",
        description: "Failed to update baby step. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleUpdateBabyStep = (metricId: string, babyStep: string) => {
    if (formattedData.length === 0) return;
    
    const latestEntry = formattedData[0];
    const entryDate = latestEntry.date;
    
    updateBabyStepMutation.mutate({
      entryDate,
      metricId,
      babyStep
    });
  };

  const noDataMessage = (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">No wellness data available for the selected date range.</p>
      </CardContent>
    </Card>
  );

  // Extract baby steps from the most recent entry
  const getBabyStepsToFocus = () => {
    if (localData.length === 0 || !localData[0].ratings) return [];
    
    // Get all baby steps from the latest entry that aren't completed
    const babySteps = localData[0].ratings
      .filter(rating => rating.babyStep && rating.babyStep.trim() !== "" && !rating.completed)
      .map(rating => ({
        metricId: rating.metricId,
        babyStep: rating.babyStep,
        score: rating.score
      }));
    
    // Sort by score (lowest first as they need more focus)
    return babySteps.sort((a, b) => a.score - b.score);
  };
  
  const babyStepsToFocus = getBabyStepsToFocus();

  return (
    <div className="grid gap-6">
      {localData.length > 0 ? <WellnessChart data={localData} /> : noDataMessage}

      {localData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Wellness Trends</CardTitle>
            <CardDescription>
              Hover over metrics to see recommendations and add or edit baby steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Only show the most recent entry */}
              {formattedData.length > 0 && (
                <WellnessHistoryItem 
                  key={0} 
                  entry={formattedData[0]} 
                  compact={false} 
                  onUpdateBabyStep={handleUpdateBabyStep}
                />
              )}
              
              {/* Baby Steps Focus Summary */}
              {babyStepsToFocus.length > 0 && (
                <div className="mt-6">
                  <Separator className="my-4" />
                  <div className="flex items-center gap-2 mb-3">
                    <ListTodo className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-lg">Key Baby Steps to Focus On</h3>
                  </div>
                  <div className="space-y-3">
                    {babyStepsToFocus.slice(0, 3).map((step, index) => {
                      // Find the metric name using the wellness metrics data
                      const metric = wellnessMetrics.find(m => m.id === step.metricId);
                      const metricName = metric?.name || "Wellness";
                      
                      return (
                        <div key={index} className="flex items-start gap-2 bg-muted/50 rounded-md p-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">{step.babyStep}</p>
                            <p className="text-sm text-muted-foreground">
                              To improve your {metricName.toLowerCase()} score ({step.score.toFixed(1)})
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTabContent;
