import { useState } from "react";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { 
  roleOptions, 
  skillOptions, 
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
            options={["FY24-Q1", "FY24-Q2", "FY24-Q3", "FY24-Q4", "FY25-Q1", "FY25-Q2"]}
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