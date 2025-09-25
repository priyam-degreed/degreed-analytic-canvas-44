import { useState } from "react";
import { DateRangeFilter } from "./DateRangeFilter";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { useFilters } from "@/contexts/FilterContext";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

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
  "Developer",
  "SDET",
  "Product Manager",
  "Data Scientist",
  "Designer",
  "Marketing Specialist",
  "Sales Representative",
  "DevOps Engineer",
  "Business Analyst",
  "Project Manager",
  "Technical Lead",
  "Engineering Manager"
];

const customAttributeOptions = [
  "Budget",
  "Completion Status",
  "Compliance",
  "Learning Hours",
  "Onboarding",
  "Skill Proficiency"
].sort();

interface FilterBarProps {
  showRoles?: boolean;
}

export function FilterBar({ showRoles = false }: FilterBarProps) {
  const { filters, updateFilter, resetFilters } = useFilters();

  return (
    <div className="flex items-center justify-between gap-3 p-4 bg-muted/30 border border-border rounded-lg mb-6 flex-wrap">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-fit">Date Range</span>
          <DateRangeFilter
            value={filters.dateRange}
            onChange={(value) => updateFilter('dateRange', value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-fit">Content Type</span>
          <MultiSelectFilter
            label="Content Type"
            options={contentTypeOptions}
            selected={filters.contentType}
            onChange={(value) => updateFilter('contentType', value)}
            placeholder="All"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-fit">Provider</span>
          <MultiSelectFilter
            label="Provider"
            options={providerOptions}
            selected={filters.provider}
            onChange={(value) => updateFilter('provider', value)}
            placeholder="All"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-fit">Skills</span>
          <MultiSelectFilter
            label="Skills"
            options={skillsOptions}
            selected={filters.skills}
            onChange={(value) => updateFilter('skills', value)}
            placeholder="All"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-fit">Groups</span>
          <MultiSelectFilter
            label="Groups"
            options={groupsOptions}
            selected={filters.groups}
            onChange={(value) => updateFilter('groups', value)}
            placeholder="All"
          />
        </div>

        {showRoles && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground min-w-fit">Roles</span>
            <MultiSelectFilter
              label="Roles"
              options={rolesOptions}
              selected={filters.roles}
              onChange={(value) => updateFilter('roles', value)}
              placeholder="All"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-fit">Custom Attribute</span>
          <MultiSelectFilter
            label="Custom Attribute"
            options={customAttributeOptions}
            selected={filters.customAttribute}
            onChange={(value) => updateFilter('customAttribute', value)}
            placeholder="All"
          />
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={resetFilters}
        className="h-8 px-3 text-xs"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Reset
      </Button>
    </div>
  );
}