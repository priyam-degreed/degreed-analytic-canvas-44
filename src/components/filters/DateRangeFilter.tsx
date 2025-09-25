import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

type FilterType = "year" | "quarter" | "month";

interface PeriodOption {
  label: string;
  type: FilterType;
  value: string;
  dateRange: DateRange;
}

// Generate period options
const generatePeriodOptions = (): PeriodOption[] => {
  const options: PeriodOption[] = [];
  
  // Years (FY24, FY25)
  const years = ["FY24", "FY25"];
  years.forEach(year => {
    const yearNum = year === "FY24" ? 2024 : 2025;
    options.push({
      label: year,
      type: "year",
      value: year,
      dateRange: {
        from: new Date(yearNum - 1, 9, 1), // Oct 1st
        to: new Date(yearNum, 8, 30)       // Sep 30th
      }
    });
  });
  
  // Quarters
  const quarters = [
    { label: "FY24 Q1", value: "FY24-Q1", from: new Date(2023, 9, 1), to: new Date(2023, 11, 31) },
    { label: "FY24 Q2", value: "FY24-Q2", from: new Date(2024, 0, 1), to: new Date(2024, 2, 31) },
    { label: "FY24 Q3", value: "FY24-Q3", from: new Date(2024, 3, 1), to: new Date(2024, 5, 30) },
    { label: "FY24 Q4", value: "FY24-Q4", from: new Date(2024, 6, 1), to: new Date(2024, 8, 30) },
    { label: "FY25 Q1", value: "FY25-Q1", from: new Date(2024, 9, 1), to: new Date(2024, 11, 31) },
    { label: "FY25 Q2", value: "FY25-Q2", from: new Date(2025, 0, 1), to: new Date(2025, 2, 31) },
  ];
  quarters.forEach(quarter => {
    options.push({
      label: quarter.label,
      type: "quarter",
      value: quarter.value,
      dateRange: { from: quarter.from, to: quarter.to }
    });
  });
  
  // Months
  const months = [
    { label: "Jan 2024", value: "2024-01", from: new Date(2024, 0, 1), to: new Date(2024, 0, 31) },
    { label: "Feb 2024", value: "2024-02", from: new Date(2024, 1, 1), to: new Date(2024, 1, 29) },
    { label: "Mar 2024", value: "2024-03", from: new Date(2024, 2, 1), to: new Date(2024, 2, 31) },
    { label: "Apr 2024", value: "2024-04", from: new Date(2024, 3, 1), to: new Date(2024, 3, 30) },
    { label: "May 2024", value: "2024-05", from: new Date(2024, 4, 1), to: new Date(2024, 4, 31) },
    { label: "Jun 2024", value: "2024-06", from: new Date(2024, 5, 1), to: new Date(2024, 5, 30) },
    { label: "Jul 2024", value: "2024-07", from: new Date(2024, 6, 1), to: new Date(2024, 6, 31) },
    { label: "Aug 2024", value: "2024-08", from: new Date(2024, 7, 1), to: new Date(2024, 7, 31) },
    { label: "Sep 2024", value: "2024-09", from: new Date(2024, 8, 1), to: new Date(2024, 8, 30) },
    { label: "Oct 2024", value: "2024-10", from: new Date(2024, 9, 1), to: new Date(2024, 9, 31) },
    { label: "Nov 2024", value: "2024-11", from: new Date(2024, 10, 1), to: new Date(2024, 10, 30) },
    { label: "Dec 2024", value: "2024-12", from: new Date(2024, 11, 1), to: new Date(2024, 11, 31) },
    { label: "Jan 2025", value: "2025-01", from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) },
    { label: "Feb 2025", value: "2025-02", from: new Date(2025, 1, 1), to: new Date(2025, 1, 28) },
    { label: "Mar 2025", value: "2025-03", from: new Date(2025, 2, 1), to: new Date(2025, 2, 31) },
  ];
  months.forEach(month => {
    options.push({
      label: month.label,
      type: "month",
      value: month.value,
      dateRange: { from: month.from, to: month.to }
    });
  });
  
  return options;
};

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<PeriodOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const periodOptions = generatePeriodOptions();

  const getDisplayText = () => {
    if (selectedOption) {
      return selectedOption.label;
    }
    return "Select period";
  };

  const handleOptionClick = (option: PeriodOption) => {
    setSelectedOption(option);
    onChange(option.dateRange);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

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
        <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 w-80 max-h-96 overflow-y-auto">
          <div className="p-4">
            {/* Years Section */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Years</h4>
              {periodOptions.filter(option => option.type === "year").map(option => (
                <div 
                  key={option.value}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer text-sm",
                    selectedOption?.value === option.value 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-accent"
                  )}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>

            {/* Quarters Section */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Quarters</h4>
              {periodOptions.filter(option => option.type === "quarter").map(option => (
                <div 
                  key={option.value}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer text-sm",
                    selectedOption?.value === option.value 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-accent"
                  )}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>

            {/* Months Section */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Months</h4>
              {periodOptions.filter(option => option.type === "month").map(option => (
                <div 
                  key={option.value}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer text-sm",
                    selectedOption?.value === option.value 
                      ? "bg-primary text-primary-foreground" 
                      : "text-foreground hover:bg-accent"
                  )}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}