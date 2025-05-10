
import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";
import WellnessTrackingForm from "@/components/WellnessTrackingForm";
import WellnessResultsView from "@/components/WellnessResultsView";
import { useWellnessTracking } from "@/hooks/useWellnessTracking";

const TrackPage = () => {
  const {
    ratings,
    submitted,
    historyData,
    isLoading,
    handleSubmit,
    handleToggleBabyStep
  } = useWellnessTracking();
  
  // Check if we're still loading data
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center">
            <p className="text-lg mb-4">Loading your wellness data...</p>
            <Progress value={undefined} className="w-48 h-2" />
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        {!submitted ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Track Today's Wellness</h1>
                <p className="text-muted-foreground">
                  Rate each of your 10 core wellness metrics and set baby steps for improvement
                </p>
              </div>
            </div>
            
            <WellnessTrackingForm onSubmit={handleSubmit} />
          </>
        ) : (
          <WellnessResultsView 
            ratings={ratings}
            historyData={historyData}
            onToggleBabyStep={handleToggleBabyStep}
          />
        )}
      </div>
    </Layout>
  );
};

export default TrackPage;
