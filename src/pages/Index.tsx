
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { demoWellnessData } from "@/data/wellnessMetrics";
import { DailyWellnessEntry } from "@/types/wellness";
import { useToast } from "@/hooks/use-toast";
import { marketplaceProducts } from "@/data/marketplaceData";
import { useAuth } from "@/contexts/AuthContext";
import { useWellnessHistory } from "@/hooks/wellness/useWellnessHistory";
import { useBabySteps } from "@/hooks/wellness/useBabySteps";

// Import our new components
import WelcomeHeader from "@/components/home/WelcomeHeader";
import TrackingPrompt from "@/components/home/TrackingPrompt";
import TrackWellnessButton from "@/components/home/TrackWellnessButton";
import WellnessSummarySection from "@/components/home/WellnessSummarySection";
import WellnessProgressChart from "@/components/home/WellnessProgressChart";
import AiCompanionCallout from "@/components/home/AiCompanionCallout";
import MarketplaceSection from "@/components/home/MarketplaceSection";

const Index = () => {
  const [wellnessData, setWellnessData] = useState(demoWellnessData);
  const [todayEntry, setTodayEntry] = useState<DailyWellnessEntry | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    historyData,
    setHistoryData,
    isLoading: isLoadingWellnessData
  } = useWellnessHistory();
  
  // Use the baby steps hook to handle toggle functionality
  const { handleToggleBabyStep } = useBabySteps(historyData);

  // Check if we already have today's entry
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    // Try to use actual history data first if available
    const dataToUse = historyData?.length > 0 ? historyData : wellnessData.entries;
    const existingEntry = dataToUse.find(entry => entry.date === today);
    if (existingEntry) {
      // Ensure the category is a valid WellnessScoreCategory
      const validatedEntry = {
        ...existingEntry,
        category: validateCategory(existingEntry.category)
      };
      setTodayEntry(validatedEntry);
    }
  }, [wellnessData, historyData]);

  // Helper function to validate that a string is a valid WellnessScoreCategory
  const validateCategory = (category: string) => {
    const validCategories = ["Unhealthy", "Healthy", "Great", "Amazing"];
    return validCategories.includes(category) ? category : "Healthy"; // Default fallback
  };
  
  const handleStepToggle = (metricId: string, completed: boolean) => {
    if (!todayEntry) return;
    
    // Update local state for immediate UI feedback
    const updatedRatings = todayEntry.ratings.map(rating => 
      rating.metricId === metricId ? {
        ...rating,
        completed
      } : rating
    );
    
    const updatedEntry = {
      ...todayEntry,
      ratings: updatedRatings
    };

    // Update today's entry
    setTodayEntry(updatedEntry);
    
    // Update the entries in the wellness data
    if (historyData.length > 0) {
      // Handle the actual data through the baby steps hook
      handleToggleBabyStep(metricId, completed, historyData, setHistoryData);
    } else {
      // For demo data
      const updatedEntries = wellnessData.entries.map(entry => 
        entry.date === updatedEntry.date ? updatedEntry : entry
      );
      
      setWellnessData(prev => ({
        ...prev,
        entries: updatedEntries
      }));
    }
  };
  
  const latestEntry = wellnessData.entries[wellnessData.entries.length - 1];
  const previousEntry = wellnessData.entries.length > 1 ? wellnessData.entries[wellnessData.entries.length - 2] : null;

  // Prepare wellness chart data - use actual user data if available
  const chartData = historyData?.length > 0 ? historyData : wellnessData.entries;

  // Get recommended products for home page display
  const recommendedProducts = marketplaceProducts.filter(product => product.tags.includes("recommended")).slice(0, 3);
  
  return (
    <Layout>
      <div className="flex flex-col space-y-8">
        <WelcomeHeader />
        
        {!todayEntry ? (
          <TrackingPrompt />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <TrackWellnessButton />
            
            <WellnessSummarySection 
              todayEntry={todayEntry} 
              previousEntry={previousEntry} 
              streakDays={wellnessData.streakDays}
              onStepToggle={handleStepToggle} 
            />
          </div>
        )}
        
        {/* Wellness Progress Chart */}
        <div className="grid grid-cols-1 gap-6">
          <WellnessProgressChart 
            isLoading={isLoadingWellnessData}
            chartData={chartData}
          />
        </div>
        
        {/* AI Companion Callout */}
        <AiCompanionCallout />
        
        {/* Wellness Marketplace Section */}
        <MarketplaceSection recommendedProducts={recommendedProducts} />
      </div>
    </Layout>
  );
};

export default Index;
