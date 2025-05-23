
import { useState } from "react";
import { WellnessRating, DailyWellnessEntry } from "@/types/wellness";
import { useWellnessHistory } from "./useWellnessHistory";
import { useWellnessSubmission } from "./useWellnessSubmission";
import { useBabySteps } from "./useBabySteps";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getWellnessCategory } from "@/data/wellnessMetrics";

/**
 * Main wellness tracking hook that combines functionality from smaller hooks
 */
export const useWellnessTracking = () => {
  const [ratings, setRatings] = useState<WellnessRating[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [category, setCategory] = useState(getWellnessCategory(0));
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Use specialized hooks
  const { historyData, setHistoryData, isLoading } = useWellnessHistory();
  const { checkAndUpdateTodayEntry } = useWellnessSubmission();
  const { handleToggleBabyStep } = useBabySteps(historyData);
  
  // Handle form submission
  const handleSubmit = (submittedRatings: WellnessRating[]) => {
    // Create exact timestamp at submission time
    const submissionTime = new Date();
    const today = submissionTime.toISOString().split('T')[0];
    const timestamp = submissionTime.toISOString();
    
    const ratingsWithDate = submittedRatings.map(rating => ({
      ...rating,
      date: today,
      timestamp: timestamp // Ensure all ratings have the exact same timestamp
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
    
    // Save to Supabase with the precise timestamp
    if (user) {
      checkAndUpdateTodayEntry.mutate({
        ratings: ratingsWithDate,
        overallScore: calculatedOverallScore,
        category: wellnessCategory,
        timestamp: timestamp // Pass the exact timestamp
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
    
    // Create a new daily wellness entry for local state with the exact submission timestamp
    const newEntry: DailyWellnessEntry = {
      date: today,
      ratings: ratingsWithDate,
      overallScore: calculatedOverallScore,
      category: wellnessCategory,
      timestamp: timestamp // Ensure the timestamp is accurately recorded
    };
    
    // Add the new entry to the history, ensuring we don't overwrite existing entries
    setHistoryData(prev => {
      // Check if we already have an entry for today
      const existingEntryIndex = prev.findIndex(entry => entry.date === today);
      
      if (existingEntryIndex >= 0) {
        // Replace today's entry with the latest one
        const updatedHistory = [...prev];
        updatedHistory[existingEntryIndex] = newEntry;
        return updatedHistory;
      } else {
        // Add the new entry to the history
        return [newEntry, ...prev];
      }
    });
    
    toast({
      title: "Wellness tracked successfully!",
      description: `Your overall wellness score today is ${calculatedOverallScore.toFixed(1)} - ${wellnessCategory}`,
    });
  };
  
  // Wrapper around the baby step toggle functionality
  const handleToggleBabyStepWrapper = (metricId: string, completed: boolean) => {
    // Update the ratings state with the new completed status
    setRatings(prev => 
      prev.map(rating => 
        rating.metricId === metricId 
          ? { ...rating, completed } 
          : rating
      )
    );
    
    // Delegate the database update to the specialized hook
    handleToggleBabyStep(metricId, completed, historyData, setHistoryData);
  };
  
  return {
    ratings,
    submitted,
    historyData,
    isLoading,
    handleSubmit,
    handleToggleBabyStep: handleToggleBabyStepWrapper,
    setSubmitted
  };
};

export default useWellnessTracking;
