
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

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
  const [showSlider, setShowSlider] = useState(false);
  
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };
  
  const starClass = sizes[size];

  // Reset state when value changes externally
  useEffect(() => {
    setShowSlider(false);
  }, [value]);
  
  const handleSliderChange = (newValue: number[]) => {
    if (!readOnly) {
      onChange(Number(newValue[0].toFixed(1)));
    }
  };

  // Handle star click with half-star precision
  const handleStarClick = (starIndex: number, event: React.MouseEvent) => {
    if (readOnly) return;
    
    const starElement = event.currentTarget;
    const rect = starElement.getBoundingClientRect();
    const starWidth = rect.width;
    const clickX = event.clientX - rect.left;
    
    // If click is on left half of star, select half star
    // If click is on right half, select full star
    const isHalfStar = clickX < starWidth / 2;
    const newValue = isHalfStar ? starIndex - 0.5 : starIndex;
    
    // If clicking exactly on current value, toggle slider for fine adjustments
    if (Math.abs(newValue - value) < 0.1) {
      setShowSlider(!showSlider);
    } else {
      onChange(newValue);
      setShowSlider(false);
    }
  };

  // Display stars based on precise rating value
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => {
      // Calculate fill percentage for this star
      let fillPercentage = 0;
      
      if (hoverValue !== null) {
        // When hovering
        if (star <= Math.floor(hoverValue)) {
          fillPercentage = 100;
        } else if (star === Math.ceil(hoverValue)) {
          fillPercentage = (hoverValue % 1) * 100;
        }
      } else {
        // Normal state (not hovering)
        if (star <= Math.floor(value)) {
          fillPercentage = 100;
        } else if (star === Math.ceil(value)) {
          fillPercentage = (value % 1) * 100;
        }
      }
      
      return (
        <button
          key={star}
          type="button"
          className={cn(
            "p-0.5 focus:outline-none transition-all relative",
            readOnly ? "cursor-default" : "cursor-pointer"
          )}
          onClick={(e) => handleStarClick(star, e)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseMove={(e) => {
            if (readOnly) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const starWidth = rect.width;
            const mouseX = e.clientX - rect.left;
            const isLeftHalf = mouseX < starWidth / 2;
            setHoverValue(isLeftHalf ? star - 0.5 : star);
          }}
          onMouseLeave={() => !readOnly && setHoverValue(null)}
          disabled={readOnly}
        >
          <Star 
            className={cn(
              starClass,
              "transition-all text-gray-300"
            )} 
          />
          {fillPercentage > 0 && (
            <div 
              className="absolute inset-0 overflow-hidden flex"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star 
                className={cn(
                  starClass,
                  "transition-all text-yellow-400 fill-yellow-400"
                )} 
              />
            </div>
          )}
        </button>
      );
    });
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        {renderStars()}
        <span className="ml-2 text-sm font-medium">
          {value.toFixed(1)}
        </span>
      </div>
      
      {showSlider && !readOnly && (
        <div className="pt-2 pb-1 px-1">
          <Slider
            value={[value]}
            min={0.1}
            max={5}
            step={0.1}
            onValueChange={handleSliderChange}
            className="w-full max-w-[240px]"
          />
        </div>
      )}
    </div>
  );
};

export default StarRating;
