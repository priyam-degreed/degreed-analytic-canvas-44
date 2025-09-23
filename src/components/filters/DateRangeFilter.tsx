import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const presets = [
  {
    label: "Last 7 Days",
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date()
    })
  },
  {
    label: "Last 30 Days",
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date()
    })
  },
  {
    label: "Last 90 Days",
    getValue: () => ({
      from: subDays(new Date(), 89),
      to: new Date()
    })
  },
  {
    label: "This Week",
    getValue: () => ({
      from: startOfWeek(new Date()),
      to: endOfWeek(new Date())
    })
  },
  {
    label: "This Month",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    })
  },
  {
    label: "This Year",
    getValue: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date())
    })
  }
];

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getDisplayText = () => {
    if (!value.from) return "Last 30 Days";
    if (!value.to) return format(value.from, "PPP");
    
    // Check if it matches a preset
    const matchingPreset = presets.find(preset => {
      const presetRange = preset.getValue();
      return value.from?.getTime() === presetRange.from?.getTime() && 
             value.to?.getTime() === presetRange.to?.getTime();
    });
    
    if (matchingPreset) return matchingPreset.label;
    
    return `${format(value.from, "MMM d")} - ${format(value.to, "MMM d, yyyy")}`;
  };

  const handlePresetClick = (preset: typeof presets[0]) => {
    const range = preset.getValue();
    setTempRange(range);
    onChange(range);
    setIsOpen(false);
  };

  const handleApply = () => {
    onChange(tempRange);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange(value);
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
        <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50">
          <div className="flex">
            {/* Presets */}
            <div className="w-48 p-3 border-r">
              <h4 className="text-sm font-medium mb-2">Quick Select</h4>
              <div className="space-y-1">
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePresetClick(preset)}
                    className="w-full justify-start text-sm h-8"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="p-3">
              <div className="mb-3">
                <h4 className="text-sm font-medium mb-2">Custom Range</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {tempRange.from ? format(tempRange.from, "MMM d, yyyy") : "Start date"} - {" "}
                    {tempRange.to ? format(tempRange.to, "MMM d, yyyy") : "End date"}
                  </span>
                </div>
              </div>
              
              <Calendar
                mode="range"
                selected={tempRange}
                onSelect={(range) => setTempRange(range || { from: undefined, to: undefined })}
                numberOfMonths={2}
                className="pointer-events-auto"
              />

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-3 border-t mt-3">
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