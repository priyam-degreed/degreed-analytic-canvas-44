import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

interface PeriodSelection {
  years: string[];
  quarters: string[];
  months: string[];
}

interface PeriodData {
  year: string;
  quarter?: string;
  month?: string;
  label: string;
  value: string;
  dateRange: DateRange;
}

// Generate hierarchical period data
const generatePeriodData = (): PeriodData[] => {
  const periods: PeriodData[] = [];
  
  // FY24 Data
  periods.push(
    // Year
    { year: "FY24", label: "FY24", value: "FY24", dateRange: { from: new Date(2023, 9, 1), to: new Date(2024, 8, 30) } },
    
    // Quarters
    { year: "FY24", quarter: "Q1", label: "FY24 Q1", value: "FY24-Q1", dateRange: { from: new Date(2023, 9, 1), to: new Date(2023, 11, 31) } },
    { year: "FY24", quarter: "Q2", label: "FY24 Q2", value: "FY24-Q2", dateRange: { from: new Date(2024, 0, 1), to: new Date(2024, 2, 31) } },
    { year: "FY24", quarter: "Q3", label: "FY24 Q3", value: "FY24-Q3", dateRange: { from: new Date(2024, 3, 1), to: new Date(2024, 5, 30) } },
    { year: "FY24", quarter: "Q4", label: "FY24 Q4", value: "FY24-Q4", dateRange: { from: new Date(2024, 6, 1), to: new Date(2024, 8, 30) } },
    
    // Months for FY24
    { year: "FY24", quarter: "Q1", month: "Oct", label: "Oct 2023", value: "2023-10", dateRange: { from: new Date(2023, 9, 1), to: new Date(2023, 9, 31) } },
    { year: "FY24", quarter: "Q1", month: "Nov", label: "Nov 2023", value: "2023-11", dateRange: { from: new Date(2023, 10, 1), to: new Date(2023, 10, 30) } },
    { year: "FY24", quarter: "Q1", month: "Dec", label: "Dec 2023", value: "2023-12", dateRange: { from: new Date(2023, 11, 1), to: new Date(2023, 11, 31) } },
    { year: "FY24", quarter: "Q2", month: "Jan", label: "Jan 2024", value: "2024-01", dateRange: { from: new Date(2024, 0, 1), to: new Date(2024, 0, 31) } },
    { year: "FY24", quarter: "Q2", month: "Feb", label: "Feb 2024", value: "2024-02", dateRange: { from: new Date(2024, 1, 1), to: new Date(2024, 1, 29) } },
    { year: "FY24", quarter: "Q2", month: "Mar", label: "Mar 2024", value: "2024-03", dateRange: { from: new Date(2024, 2, 1), to: new Date(2024, 2, 31) } },
    { year: "FY24", quarter: "Q3", month: "Apr", label: "Apr 2024", value: "2024-04", dateRange: { from: new Date(2024, 3, 1), to: new Date(2024, 3, 30) } },
    { year: "FY24", quarter: "Q3", month: "May", label: "May 2024", value: "2024-05", dateRange: { from: new Date(2024, 4, 1), to: new Date(2024, 4, 31) } },
    { year: "FY24", quarter: "Q3", month: "Jun", label: "Jun 2024", value: "2024-06", dateRange: { from: new Date(2024, 5, 1), to: new Date(2024, 5, 30) } },
    { year: "FY24", quarter: "Q4", month: "Jul", label: "Jul 2024", value: "2024-07", dateRange: { from: new Date(2024, 6, 1), to: new Date(2024, 6, 31) } },
    { year: "FY24", quarter: "Q4", month: "Aug", label: "Aug 2024", value: "2024-08", dateRange: { from: new Date(2024, 7, 1), to: new Date(2024, 7, 31) } },
    { year: "FY24", quarter: "Q4", month: "Sep", label: "Sep 2024", value: "2024-09", dateRange: { from: new Date(2024, 8, 1), to: new Date(2024, 8, 30) } },
  );
  
  // FY25 Data
  periods.push(
    // Year
    { year: "FY25", label: "FY25", value: "FY25", dateRange: { from: new Date(2024, 9, 1), to: new Date(2025, 8, 30) } },
    
    // Quarters
    { year: "FY25", quarter: "Q1", label: "FY25 Q1", value: "FY25-Q1", dateRange: { from: new Date(2024, 9, 1), to: new Date(2024, 11, 31) } },
    { year: "FY25", quarter: "Q2", label: "FY25 Q2", value: "FY25-Q2", dateRange: { from: new Date(2025, 0, 1), to: new Date(2025, 2, 31) } },
    
    // Months for FY25 (available quarters)
    { year: "FY25", quarter: "Q1", month: "Oct", label: "Oct 2024", value: "2024-10", dateRange: { from: new Date(2024, 9, 1), to: new Date(2024, 9, 31) } },
    { year: "FY25", quarter: "Q1", month: "Nov", label: "Nov 2024", value: "2024-11", dateRange: { from: new Date(2024, 10, 1), to: new Date(2024, 10, 30) } },
    { year: "FY25", quarter: "Q1", month: "Dec", label: "Dec 2024", value: "2024-12", dateRange: { from: new Date(2024, 11, 1), to: new Date(2024, 11, 31) } },
    { year: "FY25", quarter: "Q2", month: "Jan", label: "Jan 2025", value: "2025-01", dateRange: { from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) } },
    { year: "FY25", quarter: "Q2", month: "Feb", label: "Feb 2025", value: "2025-02", dateRange: { from: new Date(2025, 1, 1), to: new Date(2025, 1, 28) } },
    { year: "FY25", quarter: "Q2", month: "Mar", label: "Mar 2025", value: "2025-03", dateRange: { from: new Date(2025, 2, 1), to: new Date(2025, 2, 31) } },
  );
  
  return periods;
};

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selections, setSelections] = useState<PeriodSelection>({
    years: [],
    quarters: [],
    months: []
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const periodData = generatePeriodData();

  const getDisplayText = () => {
    const totalSelected = selections.years.length + selections.quarters.length + selections.months.length;
    if (totalSelected === 0) return "Select period";
    if (totalSelected === 1) {
      if (selections.years.length > 0) return selections.years[0];
      if (selections.quarters.length > 0) {
        const quarter = periodData.find(p => p.value === selections.quarters[0]);
        return quarter?.label || selections.quarters[0];
      }
      if (selections.months.length > 0) {
        const month = periodData.find(p => p.value === selections.months[0]);
        return month?.label || selections.months[0];
      }
    }
    return `${totalSelected} periods selected`;
  };

  const calculateDateRange = (): DateRange => {
    const allSelectedPeriods = [
      ...selections.years,
      ...selections.quarters,
      ...selections.months
    ];
    
    if (allSelectedPeriods.length === 0) {
      return { from: undefined, to: undefined };
    }
    
    const selectedData = periodData.filter(p => allSelectedPeriods.includes(p.value));
    const dates = selectedData.map(p => ({ from: p.dateRange.from!, to: p.dateRange.to! }));
    
    if (dates.length === 0) return { from: undefined, to: undefined };
    
    const minDate = new Date(Math.min(...dates.map(d => d.from.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.to.getTime())));
    
    return { from: minDate, to: maxDate };
  };

  const handleYearToggle = (year: string) => {
    setSelections(prev => {
      const isSelected = prev.years.includes(year);
      if (isSelected) {
        // Remove year and all its quarters/months
        const newQuarters = prev.quarters.filter(q => !q.startsWith(year));
        const newMonths = prev.months.filter(m => {
          const monthData = periodData.find(p => p.value === m);
          return monthData?.year !== year;
        });
        return {
          years: prev.years.filter(y => y !== year),
          quarters: newQuarters,
          months: newMonths
        };
      } else {
        return {
          ...prev,
          years: [...prev.years, year]
        };
      }
    });
  };

  const handleQuarterToggle = (quarter: string) => {
    setSelections(prev => {
      const isSelected = prev.quarters.includes(quarter);
      if (isSelected) {
        // Remove quarter and its months
        const quarterData = periodData.find(p => p.value === quarter);
        const newMonths = prev.months.filter(m => {
          const monthData = periodData.find(p => p.value === m);
          return !(monthData?.year === quarterData?.year && monthData?.quarter === quarterData?.quarter);
        });
        return {
          ...prev,
          quarters: prev.quarters.filter(q => q !== quarter),
          months: newMonths
        };
      } else {
        return {
          ...prev,
          quarters: [...prev.quarters, quarter]
        };
      }
    });
  };

  const handleMonthToggle = (month: string) => {
    setSelections(prev => {
      const isSelected = prev.months.includes(month);
      if (isSelected) {
        return {
          ...prev,
          months: prev.months.filter(m => m !== month)
        };
      } else {
        return {
          ...prev,
          months: [...prev.months, month]
        };
      }
    });
  };

  const getAvailableQuarters = () => {
    if (selections.years.length === 0) {
      return periodData.filter(p => p.quarter && !p.month);
    }
    return periodData.filter(p => 
      p.quarter && !p.month && selections.years.includes(p.year)
    );
  };

  const getAvailableMonths = () => {
    if (selections.years.length === 0 && selections.quarters.length === 0) {
      return periodData.filter(p => p.month);
    }
    if (selections.quarters.length > 0) {
      return periodData.filter(p => 
        p.month && selections.quarters.some(q => {
          const quarterData = periodData.find(qd => qd.value === q);
          return quarterData?.year === p.year && quarterData?.quarter === p.quarter;
        })
      );
    }
    if (selections.years.length > 0) {
      return periodData.filter(p => 
        p.month && selections.years.includes(p.year)
      );
    }
    return [];
  };

  const handleApply = () => {
    const dateRange = calculateDateRange();
    onChange(dateRange);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelections({ years: [], quarters: [], months: [] });
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
        <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 w-96 max-h-96 overflow-y-auto">
          <div className="p-4">
            {/* Years Section */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium text-muted-foreground uppercase">Years</h4>
              </div>
              {periodData.filter(p => !p.quarter && !p.month).map(period => (
                <div key={period.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={period.value}
                    checked={selections.years.includes(period.value)}
                    onCheckedChange={() => handleYearToggle(period.value)}
                  />
                  <label htmlFor={period.value} className="text-sm cursor-pointer">
                    {period.label}
                  </label>
                </div>
              ))}
            </div>

            {/* Quarters Section */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-medium text-muted-foreground uppercase">Quarters</h4>
              {getAvailableQuarters().map(period => (
                <div key={period.value} className="flex items-center space-x-2 ml-4">
                  <Checkbox
                    id={period.value}
                    checked={selections.quarters.includes(period.value)}
                    onCheckedChange={() => handleQuarterToggle(period.value)}
                  />
                  <label htmlFor={period.value} className="text-sm cursor-pointer">
                    {period.label}
                  </label>
                </div>
              ))}
            </div>

            {/* Months Section */}
            <div className="space-y-2 mb-4">
              <h4 className="text-xs font-medium text-muted-foreground uppercase">Months</h4>
              <div className="max-h-32 overflow-y-auto">
                {getAvailableMonths().map(period => (
                  <div key={period.value} className="flex items-center space-x-2 ml-8">
                    <Checkbox
                      id={period.value}
                      checked={selections.months.includes(period.value)}
                      onCheckedChange={() => handleMonthToggle(period.value)}
                    />
                    <label htmlFor={period.value} className="text-sm cursor-pointer">
                      {period.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-3 border-t">
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear All
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleApply}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}