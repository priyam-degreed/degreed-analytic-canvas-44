import { useState } from "react";
import { DateRangeFilter } from "./DateRangeFilter";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  roleOptions, 
  skillOptions, 
  timePeriodOptions, 
  ratingLevels, 
  ratingTypeOptions 
} from "@/data/skillProgressionData";

interface FilterState {
  dateRange: DateRange;
  roles: string[];
  skills: string[];
  timePeriod: string[];
  ratingLevels: string[];
  ratingTypes: string[];
}

interface SkillProgressionFilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
}

export function SkillProgressionFilterBar({ onFilterChange }: SkillProgressionFilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      from: subDays(new Date(), 89),
      to: new Date()
    },
    roles: [],
    skills: [],
    timePeriod: [],
    ratingLevels: [],
    ratingTypes: []
  });

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const ratingLevelOptions = ratingLevels.map(level => `${level.value} - ${level.label}`);

  return (
    <div className="flex items-center gap-2 p-3 bg-muted/30 border border-border rounded-lg mb-6 flex-wrap">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Date:</span>
        <DateRangeFilter
          value={filters.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />
      </div>

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
          options={skillOptions}
          selected={filters.skills}
          onChange={(value) => handleFilterChange('skills', value)}
          placeholder="All"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Period:</span>
        <MultiSelectFilter
          label="Time Period"
          options={timePeriodOptions}
          selected={filters.timePeriod}
          onChange={(value) => handleFilterChange('timePeriod', value)}
          placeholder="All"
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
  );
}