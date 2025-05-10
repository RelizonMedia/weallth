
import { Star } from "lucide-react";
import { CardDescription, CardTitle } from "@/components/ui/card";

interface StepsHeaderProps {
  completedCount: number;
  totalCount: number;
  starsEarned: number;
}

const StepsHeader = ({ completedCount, totalCount, starsEarned }: StepsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle className="text-lg">Today's Baby Steps</CardTitle>
        <CardDescription>Small steps toward better wellness</CardDescription>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">
          {completedCount}/{totalCount}
        </div>
        {starsEarned > 0 && (
          <div className="flex items-center bg-amber-100 px-2 py-0.5 rounded-full">
            <Star className="h-3 w-3 text-amber-500 mr-0.5 fill-amber-500" />
            <span className="text-amber-700 text-xs font-medium">{starsEarned}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepsHeader;
