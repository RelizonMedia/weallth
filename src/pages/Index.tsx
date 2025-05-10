
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import WellnessScoreDisplay from "@/components/WellnessScoreDisplay";
import WellnessChart from "@/components/WellnessChart";
import BabyStepsList from "@/components/BabyStepsList";
import WellnessStreak from "@/components/WellnessStreak";
import { Button } from "@/components/ui/button";
import { CalendarPlus, MessageCircle, ShoppingCart } from "lucide-react";
import { demoWellnessData } from "@/data/wellnessMetrics";
import { DailyWellnessEntry, WellnessRating, WellnessScoreCategory } from "@/types/wellness";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { marketplaceProducts } from "@/data/marketplaceData";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useWellnessHistory } from "@/hooks/wellness/useWellnessHistory";

const Index = () => {
  const [wellnessData, setWellnessData] = useState(demoWellnessData);
  const [todayEntry, setTodayEntry] = useState<DailyWellnessEntry | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { historyData, isLoading: isLoadingWellnessData } = useWellnessHistory();

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
  const validateCategory = (category: string): WellnessScoreCategory => {
    const validCategories: WellnessScoreCategory[] = ["Unhealthy", "Healthy", "Great", "Amazing"];
    return validCategories.includes(category as WellnessScoreCategory) 
      ? (category as WellnessScoreCategory) 
      : "Healthy"; // Default fallback
  };

  const handleStepToggle = (metricId: string, completed: boolean) => {
    if (!todayEntry) return;
    
    const updatedRatings = todayEntry.ratings.map(rating => 
      rating.metricId === metricId ? { ...rating, completed } : rating
    );
    
    const updatedEntry = { ...todayEntry, ratings: updatedRatings };
    
    // Update today's entry
    const updatedEntries = wellnessData.entries.map(entry => 
      entry.date === updatedEntry.date ? updatedEntry : entry
    );
    
    setWellnessData(prev => ({
      ...prev,
      entries: updatedEntries
    }));
    
    setTodayEntry(updatedEntry);
    
    toast({
      title: completed ? "Baby step completed!" : "Baby step unmarked",
      description: "Keep working on your wellness journey",
      duration: 3000,
    });
  };

  const latestEntry = wellnessData.entries[wellnessData.entries.length - 1];
  const previousEntry = wellnessData.entries.length > 1 
    ? wellnessData.entries[wellnessData.entries.length - 2] 
    : null;

  // Prepare wellness chart data - use actual user data if available
  const chartData = historyData?.length > 0 ? historyData : wellnessData.entries;

  // Get recommended products for home page display
  const recommendedProducts = marketplaceProducts
    .filter(product => product.tags.includes("recommended"))
    .slice(0, 3);

  return (
    <Layout>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Your Wellness Dashboard</h1>
          <p className="text-muted-foreground">
            Track, improve, and celebrate your holistic wellness journey
          </p>
        </div>
        
        {!todayEntry ? (
          <div className="flex items-center justify-center p-6 bg-muted/50 rounded-lg border border-dashed">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-medium">Track Today's Wellness</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Take a few minutes to reflect on your wellness metrics and set your baby steps for improvement.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild>
                  <Link to="/track?mode=new">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Track Today
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/ai-companion">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat with Weallth AI
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Track Wellness Today Button - with peaceful slow pulsing animation */}
            <div className="flex justify-center">
              <Button asChild 
                className="px-8 py-6 shadow-lg bg-gradient-to-r from-wellness-purple to-wellness-teal hover:from-wellness-teal hover:to-wellness-purple text-white transition-all duration-500 animate-peaceful-pulse"
                size="lg">
                <Link to="/track?mode=new" className="flex items-center gap-2">
                  <CalendarPlus className="h-6 w-6" />
                  <span className="text-base font-bold">Track Today's Wellness</span>
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {todayEntry && (
                <WellnessScoreDisplay 
                  score={todayEntry.overallScore} 
                  category={todayEntry.category}
                  previousScore={previousEntry?.overallScore}
                />
              )}
              {todayEntry && todayEntry.ratings && (
                <BabyStepsList 
                  ratings={todayEntry.ratings} 
                  onStepToggle={handleStepToggle} 
                />
              )}
              <WellnessStreak days={wellnessData.streakDays} />
            </div>
          </div>
        )}
        
        {/* Wellness Progress Chart */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-base md:text-lg">My Wellness Progress</CardTitle>
              <CardDescription className="text-xs md:text-sm">Track how your wellness has changed over time</CardDescription>
            </CardHeader>
            <CardContent className="p-2 md:p-4">
              {isLoadingWellnessData ? (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Loading your wellness data...
                </div>
              ) : chartData.length > 0 ? (
                <WellnessChart data={chartData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <p className="mb-4">No wellness data available yet.</p>
                    <Button asChild size="sm">
                      <Link to="/track?mode=new">Start Tracking</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* AI Companion Callout */}
        <div className="bg-accent/30 p-6 rounded-lg border border-accent/50">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold">Need wellness advice?</h3>
              <p className="text-muted-foreground mt-2">
                Chat with Weallth AI Companion for personalized insights and recommendations based on your wellness data.
              </p>
            </div>
            <Button asChild>
              <Link to="/ai-companion">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat with Weallth AI
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Wellness Marketplace Section */}
        <Card>
          <CardHeader>
            <CardTitle>Wellness Marketplace</CardTitle>
            <CardDescription>
              Discover products and services to enhance your wellness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button asChild variant="outline">
                <Link to="/marketplace">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Visit Full Marketplace
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
