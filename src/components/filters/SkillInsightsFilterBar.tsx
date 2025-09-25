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
  roles: string[];
}

interface SkillInsightsFilterBarProps {
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

const rolesOptions = [
  "Software Engineer",
  "Senior Software Engineer",
  "Tech Lead",
  "Engineering Manager",
  "Product Manager",
  "Senior Product Manager",
  "Data Scientist",
  "Senior Data Scientist",
  "Data Analyst",
  "UX Designer",
  "Senior UX Designer",
  "Marketing Manager",
  "Sales Manager",
  "DevOps Engineer",
  "QA Engineer",
  "Business Analyst",
  "Project Manager",
  "Scrum Master",
  "Director",
  "VP Engineering",
  "CTO"
];

export function SkillInsightsFilterBar({ onFilterChange }: SkillInsightsFilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      from: subDays(new Date(), 29),
      to: new Date()
    },
    contentType: [],
    provider: [],
    skills: [],
    groups: [],
    roles: []
  });

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

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
        <span className="text-xs text-muted-foreground whitespace-nowrap">Type:</span>
        <MultiSelectFilter
          label="Content Type"
          options={contentTypeOptions}
          selected={filters.contentType}
          onChange={(value) => handleFilterChange('contentType', value)}
          placeholder="All"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Provider:</span>
        <MultiSelectFilter
          label="Provider"
          options={providerOptions}
          selected={filters.provider}
          onChange={(value) => handleFilterChange('provider', value)}
          placeholder="All"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Skills:</span>
        <MultiSelectFilter
          label="Skills"
          options={skillsOptions}
          selected={filters.skills}
          onChange={(value) => handleFilterChange('skills', value)}
          placeholder="All"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Groups:</span>
        <MultiSelectFilter
          label="Groups"
          options={groupsOptions}
          selected={filters.groups}
          onChange={(value) => handleFilterChange('groups', value)}
          placeholder="All"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Role:</span>
        <MultiSelectFilter
          label="Role"
          options={rolesOptions}
          selected={filters.roles}
          onChange={(value) => handleFilterChange('roles', value)}
          placeholder="All"
        />
      </div>
    </div>
  );
}