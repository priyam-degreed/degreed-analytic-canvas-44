import { DateRangeFilter } from "./DateRangeFilter";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { useFilters } from "@/contexts/FilterContext";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const customAttributeOptions = [
  "Budget",
  "Completion Status",
  "Compliance",
  "Learning Hours",
  "Onboarding",
  "Skill Proficiency"
].sort();

const ratingsOptions = [1, 2, 3, 4, 5];

const regionOptions = [
  "North America (NA)",
  "Europe, Middle East & Africa (EMEA)", 
  "Asia-Pacific (APAC)"
];

const periodOptions = [
  { value: 'month', label: 'Monthly' },
  { value: 'quarter', label: 'Quarterly' },
  { value: 'year', label: 'Yearly' }
];

export function SkillInsightsFilterBar() {
  const { filters, updateFilter, resetFilters } = useFilters();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-muted/30 border border-border rounded-lg flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Period:</span>
          <Select 
            value={filters.period} 
            onValueChange={(value: 'month' | 'quarter' | 'year') => updateFilter('period', value)}
          >
            <SelectTrigger className="w-[110px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Date:</span>
          <DateRangeFilter
            value={filters.dateRange}
            onChange={(value) => updateFilter('dateRange', value)}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Role:</span>
          <MultiSelectFilter
            label="Role"
            options={rolesOptions}
            selected={filters.roles}
            onChange={(value) => updateFilter('roles', value)}
            placeholder="All"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Groups:</span>
          <MultiSelectFilter
            label="Groups"
            options={groupsOptions}
            selected={filters.groups}
            onChange={(value) => updateFilter('groups', value)}
            placeholder="All"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Skills:</span>
          <MultiSelectFilter
            label="Skills"
            options={skillsOptions}
            selected={filters.skills}
            onChange={(value) => updateFilter('skills', value)}
            placeholder="All"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="ml-auto h-8"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      <div className="flex items-center gap-2 p-3 bg-muted/30 border border-border rounded-lg flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Provider:</span>
          <MultiSelectFilter
            label="Provider"
            options={providerOptions}
            selected={filters.provider}
            onChange={(value) => updateFilter('provider', value)}
            placeholder="All"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Type:</span>
          <MultiSelectFilter
            label="Content Type"
            options={contentTypeOptions}
            selected={filters.contentType}
            onChange={(value) => updateFilter('contentType', value)}
            placeholder="All"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Ratings:</span>
          <MultiSelectFilter
            label="Ratings"
            options={ratingsOptions.map(r => `${r}★`)}
            selected={filters.ratings.map(r => `${r}★`)}
            onChange={(value) => updateFilter('ratings', value.map(v => parseInt(v.replace('★', ''))))}
            placeholder="All"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Region:</span>
          <MultiSelectFilter
            label="Region"
            options={regionOptions}
            selected={filters.region}
            onChange={(value) => updateFilter('region', value)}
            placeholder="All"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Custom:</span>
          <MultiSelectFilter
            label="Custom Attribute"
            options={customAttributeOptions}
            selected={filters.customAttribute}
            onChange={(value) => updateFilter('customAttribute', value)}
            placeholder="All"
          />
        </div>
      </div>
    </div>
  );
}