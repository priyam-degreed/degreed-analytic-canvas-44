import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, subDays, subWeeks, subMonths, subYears, subHours, subMinutes, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay, endOfDay } from "date-fns";
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
  { label: "This quarter", category: "QUARTER", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: "Last quarter", category: "QUARTER", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 3)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: "Last 4 quarters", category: "QUARTER", getValue: () => ({ from: subMonths(new Date(), 12), to: new Date() }) },
  
  // MONTH
  { label: "This month", category: "MONTH", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: "Last month", category: "MONTH", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: "Last 12 months", category: "MONTH", getValue: () => ({ from: subMonths(new Date(), 12), to: new Date() }) },
  
  // WEEK
  { label: "This week", category: "WEEK", getValue: () => ({ from: startOfWeek(new Date()), to: endOfWeek(new Date()) }) },
  { label: "Last week", category: "WEEK", getValue: () => ({ from: startOfWeek(subWeeks(new Date(), 1)), to: endOfWeek(subWeeks(new Date(), 1)) }) },
  { label: "Last 2 weeks", category: "WEEK", getValue: () => ({ from: subWeeks(new Date(), 2), to: new Date() }) },
  
  // DAY
  { label: "Today", category: "DAY", getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { label: "Yesterday", category: "DAY", getValue: () => ({ from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) }) },
  { label: "Last 7 days", category: "DAY", getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: "Last 30 days", category: "DAY", getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: "Last 90 days", category: "DAY", getValue: () => ({ from: subDays(new Date(), 90), to: new Date() }) },
  
  // HOUR
  { label: "Last hour", category: "HOUR", getValue: () => ({ from: subHours(new Date(), 1), to: new Date() }) },
  { label: "Last 8 hours", category: "HOUR", getValue: () => ({ from: subHours(new Date(), 8), to: new Date() }) },
  { label: "Last 12 hours", category: "HOUR", getValue: () => ({ from: subHours(new Date(), 12), to: new Date() }) },
  { label: "Last 24 hours", category: "HOUR", getValue: () => ({ from: subHours(new Date(), 24), to: new Date() }) },
  
  // MINUTE
  { label: "Last 15 minutes", category: "MINUTE", getValue: () => ({ from: subMinutes(new Date(), 15), to: new Date() }) },
  { label: "Last 30 minutes", category: "MINUTE", getValue: () => ({ from: subMinutes(new Date(), 30), to: new Date() }) },
  { label: "Last 45 minutes", category: "MINUTE", getValue: () => ({ from: subMinutes(new Date(), 45), to: new Date() }) },
  { label: "Last 60 minutes", category: "MINUTE", getValue: () => ({ from: subMinutes(new Date(), 60), to: new Date() }) },
];

const categories = ["YEAR", "QUARTER", "MONTH", "WEEK", "DAY", "HOUR", "MINUTE"];

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

  const handlePeriodClick = (period: RelativePeriod) => {
    const range = period.getValue();
    setTempRange(range);
    setStartDate(range.from);
    setEndDate(range.to);
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
        <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 w-96">
          <div className="p-4">
            {/* Period Type Selection */}
            <div className="space-y-3 mb-4">
              <div className="flex flex-col space-y-2">
                <Button
                  variant={periodType === "all-time" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPeriodType("all-time")}
                  className="w-full justify-start"
                >
                  All time
                </Button>
                <Button
                  variant={periodType === "static" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPeriodType("static")}
                  className="w-full justify-start"
                >
                  Static period
                </Button>
                <Button
                  variant={periodType === "relative" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPeriodType("relative")}
                  className="w-full justify-start text-blue-600"
                >
                  Relative period
                </Button>
              </div>
            </div>

            {/* Static Period Content */}
            {periodType === "static" && (
              <div className="space-y-4 mb-4">
                <Tabs defaultValue="months" className="w-full">
                  <TabsList className="grid w-full grid-cols-7 text-xs">
                    <TabsTrigger value="years">Years</TabsTrigger>
                    <TabsTrigger value="quarters">Quarters</TabsTrigger>
                    <TabsTrigger value="months">Months</TabsTrigger>
                    <TabsTrigger value="weeks">Weeks</TabsTrigger>
                    <TabsTrigger value="days">Days</TabsTrigger>
                    <TabsTrigger value="hours">Hours</TabsTrigger>
                    <TabsTrigger value="minutes">Minutes</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Period start</Label>
                      <Input placeholder="Type or select" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm">Period end</Label>
                      <Input placeholder="Type or select" className="mt-1" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Start date</Label>
                        <div className="relative mt-1">
                          <Input
                            type="date"
                            value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Start time</Label>
                        <div className="relative mt-1">
                          <Input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">End date</Label>
                        <div className="relative mt-1">
                          <Input
                            type="date"
                            value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">End time</Label>
                        <div className="relative mt-1">
                          <Input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Use date format M/d/y</div>
                      <div>Use time format HH:MM, max value is 23:59</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Relative Period Content */}
            {periodType === "relative" && (
              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                {categories.map((category) => {
                  const categoryPeriods = relativePeriods.filter(p => p.category === category);
                  if (categoryPeriods.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h5 className="text-xs font-medium text-muted-foreground mb-2">{category}</h5>
                      <div className="space-y-1">
                        {categoryPeriods.map((period) => (
                          <Button
                            key={period.label}
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePeriodClick(period)}
                            className="w-full justify-start text-sm h-8"
                          >
                            {period.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Exclude Open Period */}
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="exclude-open"
                checked={excludeOpenPeriod}
                onCheckedChange={(checked) => setExcludeOpenPeriod(checked as boolean)}
              />
              <Label htmlFor="exclude-open" className="text-sm">
                Exclude open period
              </Label>
            </div>

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