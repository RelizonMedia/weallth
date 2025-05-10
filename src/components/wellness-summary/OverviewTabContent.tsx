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
      
      // First get the entry and rating ids
      const { data: entryData, error: entryError } = await supabase
        .from('wellness_entries')
        .select('id, wellness_ratings(id, metric_id)')
        .eq('user_id', user.id)
        .eq('date', entryDate)
        .single();
      
      if (entryError) throw entryError;
      
      // Find the rating for this metric
      const rating = entryData.wellness_ratings.find((r: any) => r.metric_id === metricId);
      
      if (!rating) {
        // If no rating exists for this metric, we can't update the baby step
        throw new Error("Rating not found for this metric");
      }
      
      // Update the baby step
      const { error } = await supabase
        .from('wellness_ratings')
        .update({ 
          baby_step: babyStep,
          updated_at: new Date().toISOString()
        })
        .eq('id', rating.id);
      
      if (error) throw error;
      
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
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['wellnessEntries'] as unknown as never });
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
    }, {
      onError: (error) => {
        console.error('Error updating baby step:', error);
        toast({
          title: "Error",
          description: "Failed to update baby step. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  const noDataMessage = (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">No wellness data available for the selected date range.</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6">
      {data.length > 0 ? <WellnessChart data={data} /> : noDataMessage}

      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Wellness Trends</CardTitle>
            <CardDescription>
              Hover over metrics to see recommendations and add or edit baby steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formattedData.slice(0, 3).map((entry, index) => (
                <WellnessHistoryItem 
                  key={index} 
                  entry={entry} 
                  compact={true} 
                  onUpdateBabyStep={handleUpdateBabyStep}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OverviewTabContent;
