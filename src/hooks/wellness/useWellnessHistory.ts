
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DailyWellnessEntry, WellnessScoreCategory } from "@/types/wellness";
import { demoWellnessData } from "@/data/wellnessMetrics";
import { useState, useEffect } from "react";

/**
 * Hook for fetching wellness history data
 */
export const useWellnessHistory = () => {
  const [historyData, setHistoryData] = useState<DailyWellnessEntry[]>(demoWellnessData.entries);
  const { user } = useAuth();
  
  // Fetch user's wellness entries
  const { data: userWellnessEntries, isLoading } = useQuery({
    queryKey: ['wellnessEntries', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: entries, error } = await supabase
        .from('wellness_entries')
        .select('*, wellness_ratings(*)')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching wellness entries:', error);
        throw error;
      }

      // Transform data to match our DailyWellnessEntry structure
      return entries.map((entry): DailyWellnessEntry => ({
        date: entry.date,
        ratings: entry.wellness_ratings.map(rating => ({
          metricId: rating.metric_id,
          score: rating.score / 10, // Convert back from integer to decimal (45 -> 4.5)
          babyStep: rating.baby_step || '',
          completed: rating.completed || false,
          date: entry.date,
          id: rating.id,
          timestamp: rating.created_at || entry.created_at || new Date().toISOString()
        })),
        overallScore: entry.overall_score,
        category: entry.category as WellnessScoreCategory,
        timestamp: entry.created_at || new Date().toISOString()
      }));
    },
    enabled: !!user
  });

  // Use real data when available, fall back to demo data
  useEffect(() => {
    if (userWellnessEntries && userWellnessEntries.length > 0) {
      setHistoryData(userWellnessEntries);
    }
  }, [userWellnessEntries]);

  return {
    historyData,
    setHistoryData,
    isLoading
  };
};
