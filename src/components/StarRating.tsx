
import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

const StarRating = ({ 
  value, 
  onChange, 
  readOnly = false,
  size = "md" 
}: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };
  
  const starClass = sizes[size];
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "p-0.5 focus:outline-none transition-all",
            readOnly ? "cursor-default" : "cursor-pointer"
          )}
          onClick={() => !readOnly && onChange(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(null)}
          disabled={readOnly}
        >
          <Star 
            className={cn(
              starClass,
              "transition-all",
              (hoverValue !== null ? star <= hoverValue : star <= value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            )} 
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
