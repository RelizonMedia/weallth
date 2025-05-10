import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter } from "lucide-react";
import { format, subMonths, startOfYear } from "date-fns";

export type DateRangeType = "all" | "thisYear" | "last3Months" | "last30Days" | "custom";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangeSelectorProps {
  onRangeChange: (range: { type: DateRangeType; dateRange: DateRange }) => void;
}

const DateRangeSelector = ({ onRangeChange }: DateRangeSelectorProps) => {
  const [rangeType, setRangeType] = useState<DateRangeType>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const today = new Date();
  
  // Handle predefined range selection
  const handleRangeTypeChange = (value: DateRangeType) => {
    setRangeType(value);
    let newRange: DateRange = { from: undefined, to: undefined };
    
    switch (value) {
      case "thisYear":
        newRange = {
          from: startOfYear(today),
          to: today
        };
        break;
      case "last3Months":
        newRange = {
          from: subMonths(today, 3),
          to: today
        };
        break;
      case "last30Days":
        newRange = {
          from: subMonths(today, 1),
          to: today
        };
        break;
      case "custom":
        // For custom, we'll keep the current range and open the calendar
        newRange = dateRange;
        setIsCalendarOpen(true);
        break;
      case "all":
      default:
        // Keep undefined to show all data
        newRange = { from: undefined, to: undefined };
        break;
    }
    
    setDateRange(newRange);
    onRangeChange({ type: value, dateRange: newRange });
  };
  
  // Handle custom date range selection
  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    
    // Only trigger the callback when both from and to are selected
    if (range.from && range.to) {
      onRangeChange({ type: "custom", dateRange: range });
      setIsCalendarOpen(false);
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filter:</span>
      </div>
      
      <Select value={rangeType} onValueChange={handleRangeTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All History</SelectItem>
          <SelectItem value="thisYear">This Year</SelectItem>
          <SelectItem value="last3Months">Last 3 Months</SelectItem>
          <SelectItem value="last30Days">Last 30 Days</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      
      {rangeType === "custom" && (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DateRangeSelector;
