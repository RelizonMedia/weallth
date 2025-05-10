
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import WellnessScoreDisplay from "@/components/WellnessScoreDisplay";
import WellnessChart from "@/components/WellnessChart";
import BabyStepsList from "@/components/BabyStepsList";
import WellnessStreak from "@/components/WellnessStreak";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { demoWellnessData } from "@/data/wellnessMetrics";
import { DailyWellnessEntry, WellnessRating } from "@/types/wellness";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [wellnessData, setWellnessData] = useState(demoWellnessData);
  const [todayEntry, setTodayEntry] = useState<DailyWellnessEntry | null>(null);
  const { toast } = useToast();

  // Check if we already have today's entry
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = wellnessData.entries.find(entry => entry.date === today);
    
    if (existingEntry) {
      setTodayEntry(existingEntry);
    }
  }, [wellnessData]);

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
              <Button asChild>
                <Link to="/track">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Track Today
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WellnessScoreDisplay 
              score={todayEntry.overallScore} 
              category={todayEntry.category}
              previousScore={previousEntry?.overallScore}
            />
            <BabyStepsList 
              ratings={todayEntry.ratings} 
              onStepToggle={handleStepToggle} 
            />
            <WellnessStreak days={wellnessData.streakDays} />
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6">
          <WellnessChart data={wellnessData.entries} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
