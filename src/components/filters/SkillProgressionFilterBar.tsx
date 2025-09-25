import { useState } from "react";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { 
  roleOptions, 
  skillOptions, 
  timePeriodOptions,
  FiscalPeriod,
  ratingLevels, 
  ratingTypeOptions,
  roleSkillMapping
} from "@/data/skillProgressionData";

interface FilterState {
  roles: string[];
  skills: string[];
  timePeriod: string[];
  ratingLevels: string[];
  ratingTypes: string[];
}

interface SkillProgressionFilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
}

// Custom Period Filter Component
function PeriodFilter({ 
  selected, 
  onChange 
}: { 
  selected: string[];
  onChange: (periods: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Group periods by fiscal year and quarter
  const fiscalYears = Array.from(new Set(timePeriodOptions.map(p => p.fiscalYear)));
  const groupedPeriods = fiscalYears.reduce((acc, fy) => {
    acc[fy] = timePeriodOptions.filter(p => p.fiscalYear === fy);
    return acc;
  }, {} as Record<string, FiscalPeriod[]>);

  const handlePeriodToggle = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, value]);
    } else {
      onChange(selected.filter(p => p !== value));
    }
  };

  const handleSelectAll = () => {
    const allPeriods = timePeriodOptions.map(p => p.value);
    onChange(allPeriods);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (selected.length === 0) return "All Periods";
    if (selected.length === 1) return selected[0];
    return `${selected.length} periods selected`;
  };

  return (
    <div className="relative">
      <div 
        className="flex h-8 items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground min-w-[120px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{getDisplayText()}</span>
        <svg className="h-3 w-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-80 overflow-auto rounded-md border bg-popover p-2 shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-2 border-b">
            <button 
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <button 
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>
          {Object.entries(groupedPeriods).map(([fiscalYear, periods]) => {
            const quarters = Array.from(new Set(periods.filter(p => p.quarter).map(p => p.quarter)));
            
            return (
              <div key={fiscalYear} className="mb-3">
                <div className="font-medium text-sm mb-2 text-foreground">{fiscalYear}</div>
                {quarters.map(quarter => {
                  const quarterPeriods = periods.filter(p => p.quarter === quarter);
                  const quarterValue = `${fiscalYear}-${quarter}`;
                  
                  return (
                    <div key={quarter} className="ml-2 mb-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <Checkbox
                          id={quarterValue}
                          checked={selected.includes(quarterValue)}
                          onCheckedChange={(checked) => handlePeriodToggle(quarterValue, checked as boolean)}
                        />
                        <label htmlFor={quarterValue} className="text-sm font-medium cursor-pointer">
                          {quarter}
                        </label>
                      </div>
                      <div className="ml-6 space-y-1">
                        {quarterPeriods.filter(p => p.month).map(period => (
                          <div key={period.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={period.value}
                              checked={selected.includes(period.value)}
                              onCheckedChange={(checked) => handlePeriodToggle(period.value, checked as boolean)}
                            />
                            <label htmlFor={period.value} className="text-xs cursor-pointer">
                              {period.month}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div className="pt-2 border-t">
            <button 
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SkillProgressionFilterBar({ onFilterChange }: SkillProgressionFilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    roles: [],
    skills: [],
    timePeriod: [],
    ratingLevels: [],
    ratingTypes: []
  });

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [filterType]: value };
    
    // If roles changed, filter skills to only show applicable ones
    if (filterType === 'roles') {
      const applicableSkills = value.length > 0 
        ? Array.from(new Set(value.flatMap((role: string) => roleSkillMapping[role] || [])))
        : skillOptions;
      
      // Keep only skills that are still applicable
      newFilters.skills = newFilters.skills.filter((skill: string) => applicableSkills.includes(skill));
    }
    
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      roles: [],
      skills: [],
      timePeriod: [],
      ratingLevels: [],
      ratingTypes: []
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const ratingLevelOptions = ratingLevels.map(level => `${level.value} - ${level.label}`);

  return (
    <div className="flex items-center justify-between gap-2 p-3 bg-muted/30 border border-border rounded-lg mb-6 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Role:</span>
        <MultiSelectFilter
          label="Role"
          options={roleOptions}
          selected={filters.roles}
          onChange={(value) => handleFilterChange('roles', value)}
          placeholder="All"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Skills:</span>
        <MultiSelectFilter
          label="Skills"
          options={filters.roles.length > 0 
            ? Array.from(new Set(filters.roles.flatMap(role => roleSkillMapping[role] || [])))
            : skillOptions
          }
          selected={filters.skills}
          onChange={(value) => handleFilterChange('skills', value)}
          placeholder="All"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Period:</span>
          <MultiSelectFilter
            label="Time Period"
            options={timePeriodOptions.map(p => p.value)}
            selected={filters.timePeriod}
            onChange={(value) => handleFilterChange('timePeriod', value)}
            placeholder="All Periods"
          />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Rating:</span>
        <MultiSelectFilter
          label="Rating Level"
          options={ratingLevelOptions}
          selected={filters.ratingLevels}
          onChange={(value) => handleFilterChange('ratingLevels', value)}
          placeholder="All"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Type:</span>
        <MultiSelectFilter
          label="Rating Type"
          options={ratingTypeOptions}
          selected={filters.ratingTypes}
          onChange={(value) => handleFilterChange('ratingTypes', value)}
          placeholder="All"
        />
      </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="h-8 px-2 text-xs"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Reset
      </Button>
    </div>
  );
}