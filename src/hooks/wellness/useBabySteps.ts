
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WellnessRating, DailyWellnessEntry } from "@/types/wellness";
import { useState, useEffect } from "react";

/**
 * Hook for managing baby steps functionality
 */
export const useBabySteps = (historyData: DailyWellnessEntry[]) => {
  const [activeSteps, setActiveSteps] = useState<WellnessRating[]>([]);
  const queryClient = useQueryClient();

  // Update baby step completion status
  const updateBabyStepMutation = useMutation({
    mutationFn: async ({
      ratingId,
      completed
    }: {
      ratingId: string;
      completed: boolean;
    }) => {
      const { error } = await supabase
        .from('wellness_ratings')
        .update({ 
          completed,
          // Add timestamp for completion tracking
          updated_at: new Date().toISOString()
        })
        .eq('id', ratingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wellnessEntries'] as unknown as never });
    }
  });

  // Extract active baby steps from history data
  useEffect(() => {
    if (historyData && historyData.length > 0) {
      // Get all baby steps from history data
      const allSteps = historyData.flatMap(entry => entry.ratings)
        .filter(rating => rating.babyStep && rating.babyStep.trim() !== "");
      
      // Find the latest entry for each unique baby step (by content)
      const uniqueStepMap = new Map();
      
      allSteps.forEach(step => {
        const key = `${step.metricId}-${step.babyStep}`;
        if (!uniqueStepMap.has(key) || new Date(step.date) > new Date(uniqueStepMap.get(key).date)) {
          uniqueStepMap.set(key, step);
        }
      });
      
      // Get active steps (not completed or most recently created)
      const active = Array.from(uniqueStepMap.values())
        .filter(step => !step.completed || new Date(step.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setActiveSteps(active);
    }
  }, [historyData]);

  const handleToggleBabyStep = (metricId: string, completed: boolean, historyData: DailyWellnessEntry[], setHistoryData: React.Dispatch<React.SetStateAction<DailyWellnessEntry[]>>) => {
    // Find the corresponding rating and update if available
    if (historyData && historyData.length > 0) {
      // Get the most recent entry
      const latestEntry = historyData[0];
      const rating = latestEntry.ratings.find(r => r.metricId === metricId);
      
      // If the rating exists and has a database ID, update it
      if (rating && rating.id) {
        updateBabyStepMutation.mutate({
          ratingId: rating.id,
          completed
        }, {
          onSuccess: () => {
            // Update the local state for immediate feedback
            const updatedHistoryData = historyData.map(entry => {
              if (entry.date === latestEntry.date) {
                return {
                  ...entry,
                  ratings: entry.ratings.map(r => 
                    r.metricId === metricId ? { ...r, completed } : r
                  )
                };
              }
              return entry;
            });
            
            setHistoryData(updatedHistoryData);
          }
        });
      }
    }
  };

  return {
    activeSteps,
    updateBabyStepMutation,
    handleToggleBabyStep
  };
};
