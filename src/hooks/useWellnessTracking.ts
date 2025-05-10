
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { WellnessRating, DailyWellnessEntry, WellnessScoreCategory } from "@/types/wellness";
import { demoWellnessData, getWellnessCategory } from "@/data/wellnessMetrics";
import { useToast } from "@/hooks/use-toast";

export const useWellnessTracking = () => {
  const [ratings, setRatings] = useState<WellnessRating[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [historyData, setHistoryData] = useState<DailyWellnessEntry[]>(demoWellnessData.entries);
  const [overallScore, setOverallScore] = useState(0);
  const [category, setCategory] = useState<WellnessScoreCategory>("Healthy");
  
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
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
          score: rating.score,
          babyStep: rating.baby_step || '',
          completed: rating.completed || false,
          date: entry.date, // Use entry date for all ratings
          id: rating.id,
          timestamp: rating.created_at || new Date().toISOString() // Add timestamp information
        })),
        overallScore: entry.overall_score,
        category: entry.category as WellnessScoreCategory,
        timestamp: entry.created_at || new Date().toISOString() // Add timestamp to the entry
      }));
    },
    enabled: !!user
  });

  // Check if an entry exists for today and update instead of insert
  const checkAndUpdateTodayEntry = useMutation({
    mutationFn: async (newEntry: {
      ratings: WellnessRating[];
      overallScore: number;
      category: WellnessScoreCategory;
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      const today = new Date().toISOString().split('T')[0];
      const timestamp = new Date().toISOString(); // Capture current timestamp
      
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
        // Update existing entry
        const { error: updateError } = await supabase
          .from('wellness_entries')
          .update({
            overall_score: newEntry.overallScore,
            category: newEntry.category,
            updated_at: timestamp
          })
          .eq('id', existingEntry.id);
        
        if (updateError) throw updateError;
        
        // Delete old ratings and insert new ones
        const { error: deleteError } = await supabase
          .from('wellness_ratings')
          .delete()
          .eq('entry_id', existingEntry.id);
        
        if (deleteError) throw deleteError;
        
        // Insert new ratings
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
        // Create new entry
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
  
        // Create wellness ratings
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
      queryClient.invalidateQueries({ queryKey: ['wellnessEntries'] });
    }
  });

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
      queryClient.invalidateQueries({ queryKey: ['wellnessEntries'] });
    }
  });
  
  // Handle form submission
  const handleSubmit = (submittedRatings: WellnessRating[]) => {
    // Add creation date to each rating
    const today = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();
    
    const ratingsWithDate = submittedRatings.map(rating => ({
      ...rating,
      date: today,
      timestamp: timestamp // Add timestamp to each rating
    }));
    
    setRatings(ratingsWithDate);
    
    // Calculate overall wellness score (average of all ratings)
    const totalScore = ratingsWithDate.reduce((sum, rating) => sum + rating.score, 0);
    const calculatedOverallScore = totalScore / ratingsWithDate.length;
    const wellnessCategory = getWellnessCategory(calculatedOverallScore);
    
    // Set the calculated values to state
    setOverallScore(calculatedOverallScore);
    setCategory(wellnessCategory);
    setSubmitted(true);
    
    // Save to Supabase
    if (user) {
      checkAndUpdateTodayEntry.mutate({
        ratings: ratingsWithDate,
        overallScore: calculatedOverallScore,
        category: wellnessCategory
      }, {
        onSuccess: () => {
          toast({
            title: "Wellness tracked successfully!",
            description: "Your data has been saved to your profile",
          });
        },
        onError: (error) => {
          console.error("Error saving wellness data:", error);
          toast({
            title: "Error saving data",
            description: "There was an issue saving your wellness data",
            variant: "destructive"
          });
        }
      });
    }
    
    // Create a new daily wellness entry for local state
    const newEntry: DailyWellnessEntry = {
      date: today,
      ratings: ratingsWithDate,
      overallScore: calculatedOverallScore,
      category: wellnessCategory,
      timestamp: timestamp // Add timestamp to the entry
    };
    
    // Add the new entry to the history
    setHistoryData(prev => [newEntry, ...prev]);
    
    toast({
      title: "Wellness tracked successfully!",
      description: `Your overall wellness score today is ${calculatedOverallScore.toFixed(1)} - ${wellnessCategory}`,
    });
  };
  
  const handleToggleBabyStep = (metricId: string, completed: boolean) => {
    // Update the ratings state with the new completed status
    setRatings(prev => 
      prev.map(rating => 
        rating.metricId === metricId 
          ? { ...rating, completed } 
          : rating
      )
    );
    
    // Find the corresponding rating in the database and update if available
    // This is for when viewing baby steps after submitting
    if (user && submitted && userWellnessEntries && userWellnessEntries.length > 0) {
      // Get the most recent entry
      const latestEntry = userWellnessEntries[0];
      const rating = latestEntry.ratings.find(r => r.metricId === metricId);
      
      // If the rating exists and has a database ID, update it
      if (rating && rating.id) {
        updateBabyStepMutation.mutate({
          ratingId: rating.id,
          completed
        });
      }
    }
  };
  
  // Use real data when available, fall back to demo data
  useEffect(() => {
    if (userWellnessEntries && userWellnessEntries.length > 0) {
      setHistoryData(userWellnessEntries);
    }
  }, [userWellnessEntries]);
  
  return {
    ratings,
    submitted,
    historyData,
    isLoading,
    handleSubmit,
    handleToggleBabyStep,
    setSubmitted
  };
};
