import { DateRangeFilter } from "./DateRangeFilter";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { useFilters } from "@/contexts/FilterContext";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

// Filter options for Skills Insights
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
  "Big Data Analysis",
  "JavaScript",
  "React",
  "AWS",
  "Docker",
  "Kubernetes",
  "SQL",
  "Agile",
  "Scrum"
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

const customAttributeOptions = [
  "Budget",
  "Completion Status", 
  "Compliance",
  "Learning Hours",
  "Onboarding",
  "Skill Proficiency",
  "Performance Rating",
  "Career Level",
  "Department",
  "Years of Experience"
].sort();

const skillLevelsOptions = [
  "Beginner (1-2)",
  "Intermediate (3)", 
  "Advanced (4)",
  "Expert (5)"
];

export function SkillInsightsFilterBar() {
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

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-fit">Skill Level</span>
          <MultiSelectFilter
            label="Skill Level"
            options={skillLevelsOptions}
            selected={filters.ratings.map(r => skillLevelsOptions[r-1]).filter(Boolean)}
            onChange={(value) => updateFilter('ratings', value.map(v => skillLevelsOptions.indexOf(v) + 1).filter(v => v > 0))}
            placeholder="All"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-fit">Custom Attribute</span>
          <MultiSelectFilter
            label="Custom Attribute"
            options={customAttributeOptions}
            selected={filters.customAttribute || []}
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