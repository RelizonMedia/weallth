
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useWellnessTracking } from "@/hooks/useWellnessTracking";
import { Progress } from "@/components/ui/progress";
import BabyStepsHistory from "@/components/BabyStepsHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Plus, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WellnessRating } from "@/types/wellness";
import BabyStepsTracker from "@/components/BabyStepsTracker";

const GoalTrackerPage = () => {
  const { historyData, isLoading, handleToggleBabyStep } = useWellnessTracking();
  const [activeSteps, setActiveSteps] = useState<WellnessRating[]>([]);
  const navigate = useNavigate();

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

  // Count all completed steps from history
  const totalCompletedSteps = historyData?.flatMap(entry => 
    entry.ratings.filter(r => r.completed && r.babyStep && r.babyStep.trim() !== "")
  ).length || 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center">
            <p className="text-lg mb-4">Loading your wellness goals...</p>
            <Progress value={undefined} className="w-48 h-2" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Goal Tracker</h1>
            <p className="text-muted-foreground">
              Track, manage and review your wellness baby steps and goals
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/track')}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Track New Wellness Entry
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 lg:w-1/3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Goals Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-4xl font-bold">{totalCompletedSteps}</div>
                  <div className="ml-2 p-1.5 rounded-full bg-green-100">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Since {historyData.length > 0 
                    ? format(new Date(historyData[historyData.length - 1].date), 'MMM d, yyyy') 
                    : 'you started tracking'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Active Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-4xl font-bold">{activeSteps.filter(s => !s.completed).length}</div>
                  <div className="ml-2 p-1.5 rounded-full bg-blue-100">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {activeSteps.filter(s => !s.completed).length === 0 
                    ? "No active goals - create some!"
                    : "Goals waiting to be completed"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Last Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-lg font-bold">
                    {historyData.length > 0 
                      ? format(new Date(historyData[0].timestamp || historyData[0].date), 'MMM d, yyyy') 
                      : 'No data yet'}
                  </div>
                  <div className="ml-2 p-1.5 rounded-full bg-amber-100">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {historyData.length > 0 
                    ? `at ${format(new Date(historyData[0].timestamp || historyData[0].date), 'h:mm a')}` 
                    : 'Start tracking now'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue="active">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="active">Active Goals</TabsTrigger>
                <TabsTrigger value="history">Goal History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="space-y-4">
                {activeSteps.length > 0 ? (
                  <BabyStepsTracker 
                    ratings={activeSteps} 
                    onComplete={() => navigate('/')}
                    onToggleStep={handleToggleBabyStep}
                  />
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Target className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Active Goals</h3>
                      <p className="text-center text-muted-foreground mb-6">
                        You don't have any active goals yet. Track your wellness to create baby steps.
                      </p>
                      <Button onClick={() => navigate('/track')}>
                        Track New Entry
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="history">
                <BabyStepsHistory steps={historyData.flatMap(entry => entry.ratings)} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GoalTrackerPage;
