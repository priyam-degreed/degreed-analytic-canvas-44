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

const rolesOptions = [
  "Software Engineer",
  "Data Analyst", 
  "Project Manager",
  "Business Analyst",
  "Product Manager",
  "UX Designer",
  "DevOps Engineer",
  "Marketing Manager",
  "Sales Representative",
  "HR Manager",
  "Finance Manager",
  "Operations Manager",
  "Team Lead",
  "Senior Developer",
  "Quality Assurance"
];

const regionsOptions = [
  "North America",
  "Europe",
  "Asia-Pacific",
  "Latin America",
  "Middle East & Africa",
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "India",
  "Singapore",
  "Japan"
];

const departmentOptions = [
  "Engineering",
  "Product",
  "Marketing", 
  "Sales",
  "Data Science",
  "Design",
  "Operations",
  "Human Resources",
  "Finance",
  "Customer Success",
  "Quality Assurance",
  "Executive"
];

const skillCategoryOptions = [
  "Technical Skills",
  "Leadership & Management",
  "Data & Analytics",
  "Cloud & Infrastructure", 
  "Programming Languages",
  "Business Analysis",
  "Project Management",
  "Communication",
  "Innovation & Strategy",
  "Compliance & Security"
];

const providerOptions = [
  "Coursera",
  "LinkedIn Learning",
  "Udemy",
  "Pluralsight",
  "Internal Training",
  "External Workshop",
  "Mentoring",
  "On-the-job Training",
  "Conference",
  "Certification Program"
];

const skillStatusOptions = [
  "Active",
  "In Progress", 
  "Completed",
  "Paused",
  "Not Started",
  "Expired",
  "Needs Refresh"
];

const assessmentTypeOptions = [
  "Self-Assessment",
  "Manager Assessment",
  "Peer Assessment", 
  "360 Review",
  "Technical Test",
  "Certification",
  "Project Review",
  "Performance Review"
];

const progressStatusOptions = [
  "On Track",
  "Ahead of Schedule",
  "At Risk",
  "Behind Schedule", 
  "Blocked",
  "Completed Early",
  "Needs Support"
];

export function SkillInsightsFilterBar() {
  const { filters, updateFilter, resetFilters } = useFilters();

  return (
    <div className="bg-muted/30 border border-border rounded-lg mb-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">Filter Options</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="h-8 px-3 text-xs"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium">Date Range</span>
          <DateRangeFilter
            value={filters.dateRange}
            onChange={(value) => updateFilter('dateRange', value)}
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium">Skills</span>
          <MultiSelectFilter
            label="Skills"
            options={skillsOptions}
            selected={filters.skills}
            onChange={(value) => updateFilter('skills', value)}
            placeholder="All Skills"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium">Teams</span>
          <MultiSelectFilter
            label="Teams"
            options={groupsOptions}
            selected={filters.groups}
            onChange={(value) => updateFilter('groups', value)}
            placeholder="All Teams"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium">Job Roles</span>
          <MultiSelectFilter
            label="Roles"
            options={rolesOptions}
            selected={filters.roles}
            onChange={(value) => updateFilter('roles', value)}
            placeholder="All Roles"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium">Regions</span>
          <MultiSelectFilter
            label="Region"
            options={regionsOptions}
            selected={filters.region}
            onChange={(value) => updateFilter('region', value)}
            placeholder="All Regions"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium">Skill Level</span>
          <MultiSelectFilter
            label="Skill Level"
            options={skillLevelsOptions}
            selected={filters.ratings.map(r => skillLevelsOptions[r-1]).filter(Boolean)}
            onChange={(value) => updateFilter('ratings', value.map(v => skillLevelsOptions.indexOf(v) + 1).filter(v => v > 0))}
            placeholder="All Levels"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium">Providers</span>
          <MultiSelectFilter
            label="Provider"
            options={providerOptions}
            selected={filters.provider}
            onChange={(value) => updateFilter('provider', value)}
            placeholder="All Providers"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium">Categories</span>
          <MultiSelectFilter
            label="Skill Category"
            options={skillCategoryOptions}
            selected={filters.customAttribute?.filter(attr => skillCategoryOptions.includes(attr)) || []}
            onChange={(value) => {
              const otherAttributes = filters.customAttribute?.filter(attr => !skillCategoryOptions.includes(attr)) || [];
              updateFilter('customAttribute', [...otherAttributes, ...value]);
            }}
            placeholder="All Categories"
          />
        </div>
      </div>
    </div>
  );
}