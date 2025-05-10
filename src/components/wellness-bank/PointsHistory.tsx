import { format } from "date-fns";
import { Star, Trophy } from "lucide-react";
import { DailyWellnessEntry } from "@/types/wellness";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
interface PointsHistoryProps {
  historyData: DailyWellnessEntry[];
}
const PointsHistory = ({
  historyData
}: PointsHistoryProps) => {
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
  return <Card>
      <CardHeader>
        <CardTitle>Wellness Bank History</CardTitle>
        <CardDescription>Track your wellness points over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Wellness Score</TableHead>
              <TableHead>Points Earned</TableHead>
              <TableHead className="text-right">Baby Steps Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.map((entry, index) => {
            const pointsEarned = Math.round(entry.overallScore * 10);
            const stepsCompleted = entry.ratings.filter(r => r.completed).length;
            const entryDatetime = formatDateTime(entry.timestamp || entry.date);
            return <TableRow key={index}>
                  <TableCell className="font-medium">
                    {entryDatetime.date}
                    <div className="text-xs text-muted-foreground">
                      {entryDatetime.time}
                    </div>
                  </TableCell>
                  <TableCell>{entry.overallScore.toFixed(1)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                      <span>{pointsEarned}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Star className="h-4 w-4 mr-1 text-amber-500 fill-amber-500" />
                      <span>{stepsCompleted}</span>
                    </div>
                  </TableCell>
                </TableRow>;
          })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
};
export default PointsHistory;