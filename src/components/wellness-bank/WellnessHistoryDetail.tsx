import { format } from "date-fns";
import { Calendar, Check, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyWellnessEntry } from "@/types/wellness";
import { wellnessMetrics } from "@/data/wellnessMetrics";
interface WellnessHistoryDetailProps {
  historyData: DailyWellnessEntry[];
}
const WellnessHistoryDetail = ({
  historyData
}: WellnessHistoryDetailProps) => {
  // Helper function to ensure we have a valid date object for formatting
  const formatDateTime = (dateStr: string | undefined) => {
    if (!dateStr) return {
      date: "No date",
      time: "No time"
    };
    try {
      const date = new Date(dateStr);
      return {
        date: format(date, "MMM d, yyyy"),
        time: format(date, "h:mm a")
      };
    } catch (error) {
      console.error("Date formatting error:", error);
      return {
        date: "Invalid date",
        time: "Invalid time"
      };
    }
  };
  return;
};
export default WellnessHistoryDetail;