
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { DailyWellnessEntry } from "@/types/wellness";

export const useBabyStepsMutation = (data: DailyWellnessEntry[]) => {
  const [localData, setLocalData] = useState<DailyWellnessEntry[]>(data);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
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
    if (localData.length === 0) return;
    
    const latestEntry = localData[0];
    const entryDate = latestEntry.date;
    
    updateBabyStepMutation.mutate({
      entryDate,
      metricId,
      babyStep
    });
  };

  return {
    localData,
    handleUpdateBabyStep
  };
};
