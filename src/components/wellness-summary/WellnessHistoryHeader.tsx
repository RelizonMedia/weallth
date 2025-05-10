
import { Clock } from "lucide-react";
import { getCategoryTextColor } from "@/utils/wellnessScoreUtils";

interface WellnessHistoryHeaderProps {
  formattedDate: string;
  formattedTime: string;
  category: string;
}

const WellnessHistoryHeader = ({ formattedDate, formattedTime, category }: WellnessHistoryHeaderProps) => {
  // Get the appropriate text color for the category
  const categoryColor = getCategoryTextColor(category);
  
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {formattedDate} at {formattedTime}
        </span>
      </div>
      <div className={`bg-opacity-10 px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}>
        {category}
      </div>
    </div>
  );
};

export default WellnessHistoryHeader;
