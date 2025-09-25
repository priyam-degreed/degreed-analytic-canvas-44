import { useState } from "react";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { RotateCcw, ChevronDown, Filter } from "lucide-react";
import { fiscalPeriods, providers, contentTypes } from "@/data/learningData";

// Role options
const roleOptions = [
  "Data Scientist",
  "Backend Engineer", 
  "Frontend Engineer",
  "Product Manager",
  "DevOps Engineer",
  "ML Engineer",
  "UX Designer",
  "Engineering Manager",
  "Technical Lead",
  "Business Analyst"
];

// Rating options
const ratingOptions = [
  { value: 5, label: "5 Stars" },
  { value: 4, label: "4 Stars" },
  { value: 3, label: "3 Stars" },
  { value: 2, label: "2 Stars" },
  { value: 1, label: "1 Star" }
];

// Skills options
const skillOptions = [
  "Python", "Machine Learning", "SQL", "JavaScript", "React", "AWS", 
  "Docker", "Leadership", "Product Strategy", "Data Analytics",
  "System Design", "Communication", "TypeScript", "Node.js"
];

interface LearningFilters {
  roles: string[];
  contentTypes: string[];
  providers: string[];
  ratings: number[];
  periods: string[];
  skills: string[];
}

interface LearningFilterBarProps {
  filters: LearningFilters;
  onFiltersChange: (filters: LearningFilters) => void;
}

export function LearningFilterBar({ filters, onFiltersChange }: LearningFilterBarProps) {
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  const updateFilter = <K extends keyof LearningFilters>(
    key: K,
    value: LearningFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      roles: [],
      contentTypes: [],
      providers: [],
      ratings: [],
      periods: [],
      skills: []
    });
  };

  // Organize periods by fiscal year and quarter for better UI
  const periodsByYear = fiscalPeriods.reduce((acc, period) => {
    if (!acc[period.fiscalYear]) {
      acc[period.fiscalYear] = {};
    }
    if (!acc[period.fiscalYear][period.quarter]) {
      acc[period.fiscalYear][period.quarter] = [];
    }
    acc[period.fiscalYear][period.quarter].push(period);
    return acc;
  }, {} as Record<string, Record<string, typeof fiscalPeriods>>);

  const handlePeriodChange = (periodValue: string, checked: boolean) => {
    if (checked) {
      updateFilter('periods', [...filters.periods, periodValue]);
    } else {
      updateFilter('periods', filters.periods.filter(p => p !== periodValue));
    }
  };

  const handleFiscalYearChange = (fiscalYear: string, checked: boolean) => {
    const yearPeriods = Object.values(periodsByYear[fiscalYear])
      .flat()
      .map(p => p.value);
    
    if (checked) {
      const newPeriods = [...new Set([...filters.periods, ...yearPeriods])];
      updateFilter('periods', newPeriods);
    } else {
      updateFilter('periods', filters.periods.filter(p => !yearPeriods.includes(p)));
    }
  };

  const handleQuarterChange = (fiscalYear: string, quarter: string, checked: boolean) => {
    const quarterPeriods = periodsByYear[fiscalYear][quarter].map(p => p.value);
    
    if (checked) {
      const newPeriods = [...new Set([...filters.periods, ...quarterPeriods])];
      updateFilter('periods', newPeriods);
    } else {
      updateFilter('periods', filters.periods.filter(p => !quarterPeriods.includes(p)));
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Learning Dashboard Filters
          </CardTitle>
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
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Row 1: Role, Content Type, Provider */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <MultiSelectFilter
              label="Role"
              options={roleOptions}
              selected={filters.roles}
              onChange={(value) => updateFilter('roles', value)}
              placeholder="All Roles"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Content Type</label>
            <MultiSelectFilter
              label="Content Type"
              options={Array.from(contentTypes)}
              selected={filters.contentTypes}
              onChange={(value) => updateFilter('contentTypes', value)}
              placeholder="All Types"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Provider</label>
            <MultiSelectFilter
              label="Provider"
              options={providers}
              selected={filters.providers}
              onChange={(value) => updateFilter('providers', value)}
              placeholder="All Providers"
            />
          </div>
        </div>

        {/* Row 2: Ratings, Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Ratings</label>
            <MultiSelectFilter
              label="Ratings"
              options={ratingOptions.map(r => r.label)}
              selected={filters.ratings.map(r => ratingOptions.find(opt => opt.value === r)?.label || '')}
              onChange={(selectedLabels) => {
                const selectedValues = selectedLabels
                  .map(label => ratingOptions.find(opt => opt.label === label)?.value)
                  .filter((val): val is number => val !== undefined);
                updateFilter('ratings', selectedValues);
              }}
              placeholder="All Ratings"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Skills</label>
            <MultiSelectFilter
              label="Skills"
              options={skillOptions}
              selected={filters.skills}
              onChange={(value) => updateFilter('skills', value)}
              placeholder="All Skills"
            />
          </div>
        </div>

        {/* Row 3: Time Period with Hierarchical Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Time Period</label>
          <Collapsible open={isPeriodOpen} onOpenChange={setIsPeriodOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>
                  {filters.periods.length === 0 
                    ? "All Periods" 
                    : `${filters.periods.length} period${filters.periods.length === 1 ? '' : 's'} selected`
                  }
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="space-y-4">
                  {Object.entries(periodsByYear).map(([fiscalYear, quarters]) => {
                    const yearPeriods = Object.values(quarters).flat().map(p => p.value);
                    const isYearSelected = yearPeriods.every(p => filters.periods.includes(p));
                    const isYearPartiallySelected = yearPeriods.some(p => filters.periods.includes(p)) && !isYearSelected;
                    
                    return (
                      <div key={fiscalYear} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`year-${fiscalYear}`}
                            checked={isYearSelected}
                            onCheckedChange={(checked) => handleFiscalYearChange(fiscalYear, checked as boolean)}
                          />
                          <label 
                            htmlFor={`year-${fiscalYear}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {fiscalYear}
                          </label>
                        </div>
                        
                        <div className="ml-6 space-y-2">
                          {Object.entries(quarters).map(([quarter, months]) => {
                            const quarterPeriods = months.map(p => p.value);
                            const isQuarterSelected = quarterPeriods.every(p => filters.periods.includes(p));
                            const isQuarterPartiallySelected = quarterPeriods.some(p => filters.periods.includes(p)) && !isQuarterSelected;
                            
                            return (
                              <div key={`${fiscalYear}-${quarter}`} className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`quarter-${fiscalYear}-${quarter}`}
                                    checked={isQuarterSelected}
                                    onCheckedChange={(checked) => handleQuarterChange(fiscalYear, quarter, checked as boolean)}
                                  />
                                  <label 
                                    htmlFor={`quarter-${fiscalYear}-${quarter}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {quarter}
                                  </label>
                                </div>
                                
                                <div className="ml-6 grid grid-cols-3 gap-2">
                                  {months.map((period) => (
                                    <div key={period.value} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`period-${period.value}`}
                                        checked={filters.periods.includes(period.value)}
                                        onCheckedChange={(checked) => handlePeriodChange(period.value, checked as boolean)}
                                      />
                                      <label 
                                        htmlFor={`period-${period.value}`}
                                        className="text-xs cursor-pointer"
                                      >
                                        {period.month}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}