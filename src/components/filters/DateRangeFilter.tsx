import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfQuarter, endOfQuarter, subQuarters } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

type PeriodType = "all-time" | "static" | "relative";

interface RelativePeriod {
  label: string;
  category: string;
  getValue: () => DateRange;
}

const relativePeriods: RelativePeriod[] = [
  // YEAR
  { label: "This year", category: "YEAR", getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
  { label: "Last year", category: "YEAR", getValue: () => ({ from: startOfYear(subYears(new Date(), 1)), to: endOfYear(subYears(new Date(), 1)) }) },
  
  // QUARTER
  { label: "This quarter", category: "QUARTER", getValue: () => ({ from: startOfQuarter(new Date()), to: endOfQuarter(new Date()) }) },
  { label: "Last quarter", category: "QUARTER", getValue: () => ({ from: startOfQuarter(subQuarters(new Date(), 1)), to: endOfQuarter(subQuarters(new Date(), 1)) }) },
  { label: "Last 4 quarters", category: "QUARTER", getValue: () => ({ from: startOfQuarter(subQuarters(new Date(), 3)), to: endOfQuarter(new Date()) }) },
  
  // MONTH
  { label: "This month", category: "MONTH", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: "Last month", category: "MONTH", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: "Last 3 months", category: "MONTH", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 2)), to: endOfMonth(new Date()) }) },
  { label: "Last 6 months", category: "MONTH", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 5)), to: endOfMonth(new Date()) }) },
  { label: "Last 12 months", category: "MONTH", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 11)), to: endOfMonth(new Date()) }) },
];

const categories = ["YEAR", "QUARTER", "MONTH"];

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [periodType, setPeriodType] = useState<PeriodType>("relative");
  const [tempRange, setTempRange] = useState<DateRange>(value);
  const [excludeOpenPeriod, setExcludeOpenPeriod] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(value.from);
  const [endDate, setEndDate] = useState<Date | undefined>(value.to);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getDisplayText = () => {
    if (periodType === "all-time") return "All time";
    if (!value.from) return "Last 30 Days";
    if (!value.to) return format(value.from, "PPP");
    
    // Check if it matches a relative period
    const matchingPeriod = relativePeriods.find(period => {
      const periodRange = period.getValue();
      return value.from?.getTime() === periodRange.from?.getTime() && 
             value.to?.getTime() === periodRange.to?.getTime();
    });
    
    if (matchingPeriod) return matchingPeriod.label;
    
    return `${format(value.from, "MMM d")} - ${format(value.to, "MMM d, yyyy")}`;
  };

  const handleAllTimeClick = () => {
    onChange({ from: undefined, to: undefined });
    setIsOpen(false);
  };

  const handlePeriodClick = (period: RelativePeriod) => {
    const range = period.getValue();
    setTempRange(range);
    setStartDate(range.from);
    setEndDate(range.to);
    onChange(range);
    setIsOpen(false);
  };

  const handleStaticDateChange = () => {
    if (startDate && endDate) {
      // Combine date with time
      const from = new Date(startDate);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      from.setHours(startHours, startMinutes);
      
      const to = new Date(endDate);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      to.setHours(endHours, endMinutes);
      
      setTempRange({ from, to });
    }
  };

  const handleApply = () => {
    if (periodType === "all-time") {
      onChange({ from: undefined, to: undefined });
    } else {
      onChange(tempRange);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange(value);
    setStartDate(value.from);
    setEndDate(value.to);
    setIsOpen(false);
  };

  // Update static dates when they change
  useEffect(() => {
    if (periodType === "static") {
      handleStaticDateChange();
    }
  }, [startDate, endDate, startTime, endTime, periodType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-40 justify-between text-left font-normal"
        )}
      >
        <span className="truncate">{getDisplayText()}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 w-80">
          <div className="p-4">
            {/* Period Type Selection */}
            <div className="space-y-2 mb-4">
              <div 
                className={cn(
                  "p-3 rounded-lg cursor-pointer text-sm font-medium",
                  periodType === "all-time" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                )}
                onClick={handleAllTimeClick}
              >
                All time
              </div>
              <div 
                className={cn(
                  "p-3 rounded-lg cursor-pointer text-sm font-medium",
                  periodType === "static" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                )}
                onClick={() => setPeriodType("static")}
              >
                Static period
              </div>
              <div 
                className={cn(
                  "p-3 rounded-lg cursor-pointer text-sm font-medium",
                  periodType === "relative" ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                )}
                onClick={() => setPeriodType("relative")}
              >
                Relative period
              </div>
            </div>


            {/* Relative Period Content */}
            {periodType === "relative" && (
              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                {categories.map((category) => {
                  const categoryPeriods = relativePeriods.filter(p => p.category === category);
                  if (categoryPeriods.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h5 className="text-xs font-medium text-muted-foreground uppercase mb-2">{category}</h5>
                      <div className="space-y-1 ml-4">
                        {categoryPeriods.map((period) => (
                          <div
                            key={period.label}
                            onClick={() => handlePeriodClick(period)}
                            className="cursor-pointer text-sm py-2 px-2 hover:bg-accent rounded text-foreground"
                          >
                            {period.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}


            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}