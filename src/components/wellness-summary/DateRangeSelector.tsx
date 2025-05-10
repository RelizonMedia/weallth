
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format, subDays, subMonths, startOfYear } from "date-fns";
import { cn } from "@/lib/utils";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type DateRangeOption = {
  label: string;
  value: string;
  range: () => DateRange;
};

interface DateRangeSelectorProps {
  onRangeChange: (range: DateRange) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ onRangeChange }) => {
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("all");
  
  const today = new Date();
  
  const predefinedRanges: DateRangeOption[] = [
    {
      label: "All time",
      value: "all",
      range: () => ({ from: undefined, to: undefined }),
    },
    {
      label: "This year",
      value: "thisYear",
      range: () => ({ from: startOfYear(today), to: today }),
    },
    {
      label: "Last 3 months",
      value: "last3Months",
      range: () => ({ from: subMonths(today, 3), to: today }),
    },
    {
      label: "Last 30 days",
      value: "last30Days",
      range: () => ({ from: subDays(today, 30), to: today }),
    },
    {
      label: "Custom range",
      value: "custom",
      range: () => dateRange,
    },
  ];

  const handleOptionSelect = (option: DateRangeOption) => {
    const newRange = option.range();
    setSelectedOption(option.value);
    
    // Only set calendar open if custom range is selected
    if (option.value === "custom") {
      setIsCalendarOpen(true);
      return;
    }
    
    setIsCalendarOpen(false);
    setDateRange(newRange);
    onRangeChange(newRange);
  };

  const handleCalendarSelect = (range: DateRange) => {
    if (range.from && range.to) {
      setDateRange(range);
      onRangeChange(range);
      setIsCalendarOpen(false);
    }
  };
  
  const getDisplayText = () => {
    if (selectedOption === "custom" && dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    
    const selectedPreset = predefinedRanges.find(r => r.value === selectedOption);
    return selectedPreset?.label || "Select date range";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "w-[240px] justify-between text-left font-normal"
              )}
            >
              <div className="truncate">
                <CalendarIcon className="mr-2 h-4 w-4 inline-block" />
                {getDisplayText()}
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-2 border-b">
              <div className="grid grid-cols-1 gap-1">
                {predefinedRanges.map((range) => (
                  <Button
                    key={range.value}
                    variant={selectedOption === range.value ? "default" : "ghost"}
                    className="justify-start font-normal"
                    onClick={() => handleOptionSelect(range)}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
            {selectedOption === "custom" && (
              <div className="p-2">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleCalendarSelect}
                  numberOfMonths={2}
                  disabled={{ after: new Date() }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateRangeSelector;
