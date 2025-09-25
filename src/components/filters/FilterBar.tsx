import { useState } from "react";
import { DateRangeFilter } from "./DateRangeFilter";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";

interface FilterState {
  dateRange: DateRange;
  contentType: string[];
  provider: string[];
  skills: string[];
  groups: string[];
}

interface FilterBarProps {
  onFilterChange?: (filters: FilterState) => void;
}

// Filter options
const contentTypeOptions = [
  "Academy",
  "Article", 
  "Assessment",
  "Book",
  "Course",
  "Event",
  "Podcast",
  "Task"
];

const providerOptions = [
  "Codecademy",
  "Cloud Academy", 
  "Udemy",
  "Coursera",
  "Pluralsight",
  "LinkedIn Learning",
  "edX",
  "Skillsoft"
];

const skillsOptions = [
  "Leadership",
  "Data Visualization",
  "Project Management", 
  "Business Intelligence",
  "Python Programming",
  "Machine Learning",
  "Cloud Computing",
  "Data Analytics",
  "Innovation",
  "Java",
  "Business Analysis",
  "Big Data Analysis"
];

const groupsOptions = [
  "Engineering Team",
  "Product Team",
  "Marketing Team",
  "Sales Team",
  "Data Science Team",
  "Design Team",
  "Operations Team",
  "HR Team",
  "Finance Team",
  "Executive Team",
  "Customer Success Team",
  "Quality Assurance Team"
];

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      from: subDays(new Date(), 29),
      to: new Date()
    },
    contentType: [],
    provider: [],
    skills: [],
    groups: []
  });

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-muted/30 border border-border rounded-lg mb-6 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground min-w-fit">Date Range</span>
        <DateRangeFilter
          value={filters.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground min-w-fit">Content Type</span>
        <MultiSelectFilter
          label="Content Type"
          options={contentTypeOptions}
          selected={filters.contentType}
          onChange={(value) => handleFilterChange('contentType', value)}
          placeholder="All"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground min-w-fit">Provider</span>
        <MultiSelectFilter
          label="Provider"
          options={providerOptions}
          selected={filters.provider}
          onChange={(value) => handleFilterChange('provider', value)}
          placeholder="All"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground min-w-fit">Skills</span>
        <MultiSelectFilter
          label="Skills"
          options={skillsOptions}
          selected={filters.skills}
          onChange={(value) => handleFilterChange('skills', value)}
          placeholder="All"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground min-w-fit">Groups</span>
        <MultiSelectFilter
          label="Groups"
          options={groupsOptions}
          selected={filters.groups}
          onChange={(value) => handleFilterChange('groups', value)}
          placeholder="All"
        />
      </div>
    </div>
  );
}