
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { WellnessRating, WellnessScoreCategory } from "@/types/wellness";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for handling wellness submission functionality
 */
export const useWellnessSubmission = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Check if an entry exists for today and update instead of insert
  const checkAndUpdateTodayEntry = useMutation({
    mutationFn: async (newEntry: {
      ratings: WellnessRating[];
      overallScore: number;
      category: WellnessScoreCategory;
      timestamp?: string; // Accept a custom timestamp if provided
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      const today = new Date().toISOString().split('T')[0];
      // Use the provided timestamp or generate a new one
      const timestamp = newEntry.timestamp || new Date().toISOString();
      
      // Check if entry for today exists
      const { data: existingEntry, error: checkError } = await supabase
        .from('wellness_entries')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        // Error other than "not found"
        throw checkError;
      }
      
      if (existingEntry) {
        // Update existing entry with current timestamp to reflect the latest update
        const { error: updateError } = await supabase
          .from('wellness_entries')
          .update({
            overall_score: newEntry.overallScore,
            category: newEntry.category,
            updated_at: timestamp,
            created_at: timestamp // Also update created_at to reflect the latest entry time
          })
          .eq('id', existingEntry.id);
        
        if (updateError) throw updateError;
        
        // Delete old ratings and insert new ones
        const { error: deleteError } = await supabase
          .from('wellness_ratings')
          .delete()
          .eq('entry_id', existingEntry.id);
        
        if (deleteError) throw deleteError;
        
        // Insert new ratings with the current timestamp
        const ratingsToInsert = newEntry.ratings.map(rating => ({
          entry_id: existingEntry.id,
          metric_id: rating.metricId,
          score: rating.score,
          baby_step: rating.babyStep,
          completed: rating.completed,
          created_at: timestamp
        }));
        
        const { error: ratingsError } = await supabase
          .from('wellness_ratings')
          .insert(ratingsToInsert);
        
        if (ratingsError) throw ratingsError;
        
        return existingEntry.id;
      } else {
        // Create new entry with exact timestamp
        const { data: entryData, error: entryError } = await supabase
          .from('wellness_entries')
          .insert({
            user_id: user.id,
            date: today,
            overall_score: newEntry.overallScore,
            category: newEntry.category,
            created_at: timestamp
          })
          .select('id')
          .single();
  
        if (entryError) throw entryError;
  
        // Create wellness ratings with the exact same timestamp
        const ratingsToInsert = newEntry.ratings.map(rating => ({
          entry_id: entryData.id,
          metric_id: rating.metricId,
          score: rating.score,
          baby_step: rating.babyStep,
          completed: rating.completed,
          created_at: timestamp
        }));
  
        const { error: ratingsError } = await supabase
          .from('wellness_ratings')
          .insert(ratingsToInsert);
  
        if (ratingsError) throw ratingsError;
  
        return entryData.id;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wellnessEntries'] as unknown as never });
    }
  });

  return {
    checkAndUpdateTodayEntry
  };
};
