import { useState, useEffect } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillProgressionFilterBar } from "@/components/filters/SkillProgressionFilterBar";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Award,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from "lucide-react";
import { 
  skillProgressionMetrics,
  skillDistributionData,
  skillProgressionEntries,
  generateHeatmapData,
  generateBubbleData,
  roleSkillMapping,
  periodLabels
} from "@/data/skillProgressionData";

// Custom colors for different rating levels
const ratingColors = {
  beginner: "#ef4444",     // red
  capable: "#f97316",      // orange  
  intermediate: "#eab308", // yellow
  effective: "#84cc16",    // lime
  experienced: "#22c55e",  // green
  advanced: "#10b981",     // emerald
  distinguished: "#06b6d4", // cyan
  master: "#8b5cf6"        // violet
};

const priorityColors = {
  positive: "#22c55e",
  negative: "#ef4444",
  neutral: "#64748b"
};

interface FilterState {
  roles: string[];
  skills: string[];
  timePeriod: string[];
  ratingLevels: string[];
  ratingTypes: string[];
}

export default function SkillProgression() {
  const [filters, setFilters] = useState<FilterState>({
    roles: [],
    skills: [],
    timePeriod: [],
    ratingLevels: [],
    ratingTypes: []
  });

  // Apply filters to data - each filter works independently and in combination
  const filteredData = skillDistributionData.filter(item => {
    // Role filter - independent
    const roleMatch = filters.roles.length === 0 || filters.roles.includes(item.role);
    
    // Skill filter - independent
    const skillMatch = filters.skills.length === 0 || filters.skills.includes(item.skill);
    
    // Time period filter - independent, handles quarters and fiscal years
    const periodMatch = filters.timePeriod.length === 0 || filters.timePeriod.some(period => 
      item.timePeriod === period || 
      (period.includes('-Q') && item.timePeriod.startsWith(period)) ||
      (period.startsWith('FY') && !period.includes('-') && item.timePeriod.startsWith(period))
    );
    
    // Rating level filter - independent, based on avgRating ranges
    const ratingLevelMatch = filters.ratingLevels.length === 0 || filters.ratingLevels.some(level => {
      const rating = item.avgRating;
      // Extract the range from the format "1 - Beginner"
      if (level.includes('1 - ')) return rating >= 1 && rating < 2;
      if (level.includes('2 - ')) return rating >= 2 && rating < 3;
      if (level.includes('3 - ')) return rating >= 3 && rating < 4;
      if (level.includes('4 - ')) return rating >= 4 && rating < 5;
      if (level.includes('5 - ')) return rating >= 5 && rating < 6;
      if (level.includes('6 - ')) return rating >= 6 && rating < 7;
      if (level.includes('7 - ')) return rating >= 7 && rating < 8;
      if (level.includes('8 - ')) return rating >= 8 && rating <= 8;
      return true;
    });
    
    // Rating type filter - independent, match against actual data
    const ratingTypeMatch = filters.ratingTypes.length === 0 || filters.ratingTypes.some(type => {
      // Find the actual rating type for this item from skillProgressionEntries
      const entry = skillProgressionEntries.find(e => 
        e.role === item.role && 
        e.skillName === item.skill && 
        e.timePeriod === item.timePeriod
      );
      return entry ? entry.ratingType === type : true;
    });
    
    // All filters must match (AND logic)
    return roleMatch && skillMatch && periodMatch && ratingLevelMatch && ratingTypeMatch;
  });

  // Get unique values based on full dataset (not filtered) for dropdown options
  const allRoles = Array.from(new Set(skillDistributionData.map(d => d.role)));
  const allSkills = Array.from(new Set(skillDistributionData.map(d => d.skill)));
  const allPeriods = Array.from(new Set(skillDistributionData.map(d => d.timePeriod)));

  // Get available values for current context (for chart display)
  const availableRoles = filters.roles.length > 0 ? filters.roles : allRoles;
  const availableSkills = filters.skills.length > 0 ? filters.skills : allSkills;
  const availablePeriods = filters.timePeriod.length > 0 ? filters.timePeriod : allPeriods;

  // Pagination state - reset to 0 when filters change
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  // Apply pagination to all data - limit to 10 entries by default
  const paginatedData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Prepare line chart data for Progress Over Time - use paginated skills
  const paginatedSkills = availableSkills.slice(0, Math.min(10, availableSkills.length));
  const progressData = availablePeriods.map(period => {
    const periodData: any = { period };
    paginatedSkills.forEach(skill => {
      const skillData = filteredData.find(
        item => item.timePeriod === period && item.skill === skill && availableRoles.includes(item.role)
      );
      periodData[skill] = skillData?.avgRating || 0;
    });
    return periodData;
  });

  // Prepare grouped bar chart data for Current vs Target Ratings - use paginated skills
  const currentVsTargetData = paginatedSkills.map(skill => {
    const skillData = filteredData.filter(item => item.skill === skill && availableRoles.includes(item.role));
    const avgCurrent = skillData.length > 0 ? 
      skillData.reduce((sum, item) => sum + item.avgRating, 0) / skillData.length : 0;
    const target = 6 + Math.random() * 2; // Random target between 6-8
    
    return {
      skill,
      current: avgCurrent,
      target: target
    };
  });

          // Prepare skill gaps data for horizontal progress bars - use paginated skills
  const skillGapsData = paginatedSkills.map(skill => {
    const skillData = filteredData.filter(item => item.skill === skill && availableRoles.includes(item.role));
    const avgCurrent = skillData.length > 0 ? 
      skillData.reduce((sum, item) => sum + item.avgRating, 0) / skillData.length : 0;
    const target = 6 + Math.random() * 2; // Random target between 6-8
    const gap = target - avgCurrent;
    const priority = gap > 1.5 ? 'HIGH' : gap > 0.8 ? 'MEDIUM' : 'LOW';
    
    return {
      skill,
      current: avgCurrent,
      target: target,
      gap: gap,
      priority: priority,
      progress: (avgCurrent / target) * 100
    };
  });

  // Generate dynamic data based on filters and pagination
  const allHeatmapData = generateHeatmapData(filteredData);
  const allBubbleData = generateBubbleData(filteredData).map(item => ({
    ...item,
    color: item.changeVsLastQuarter > 0.2 ? priorityColors.positive :
           item.changeVsLastQuarter < -0.2 ? priorityColors.negative :
           priorityColors.neutral
  }));

  // Apply pagination to heatmap and bubble data
  const heatmapData = allHeatmapData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const bubbleData = allBubbleData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  
  // Pagination info
  const totalHeatmapPages = Math.ceil(allHeatmapData.length / itemsPerPage);
  const totalBubblePages = Math.ceil(allBubbleData.length / itemsPerPage);
  const totalFilteredPages = Math.ceil(filteredData.length / itemsPerPage);

  // Calculate filtered metrics
  const filteredMetrics = {
    totalEmployees: filteredData.length > 0 ? Math.floor(Math.random() * 200) + 100 : 0,
    avgSkillRating: filteredData.length > 0 ? 
      filteredData.reduce((sum, item) => sum + item.avgRating, 0) / filteredData.length : 0,
    employeesAboveThreshold: filteredData.length > 0 ? 
      Math.floor((filteredData.filter(item => item.avgRating >= 6).length / filteredData.length) * 100) : 0,
    progressionPercent: Math.random() * 20 + 10,
    skillGapToTarget: filteredData.length > 0 ?
      Math.max(0, 6 - (filteredData.reduce((sum, item) => sum + item.avgRating, 0) / filteredData.length)) : 0
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Custom tooltip for bubble chart
  const CustomBubbleTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{data.skill}</p>
          <p className="text-sm text-muted-foreground">Importance: {data.importance.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">Avg Rating: {data.avgRating.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">Employees: {data.employeeCount}</p>
          <div className="flex items-center gap-1 text-sm">
            <span>Change:</span>
            {data.changeVsLastQuarter > 0 ? (
              <div className="flex items-center text-green-600">
                <ArrowUpIcon className="w-3 h-3" />
                <span>+{(data.changeVsLastQuarter * 100).toFixed(1)}%</span>
              </div>
            ) : data.changeVsLastQuarter < 0 ? (
              <div className="flex items-center text-red-600">
                <ArrowDownIcon className="w-3 h-3" />
                <span>{(data.changeVsLastQuarter * 100).toFixed(1)}%</span>
              </div>
            ) : (
              <div className="flex items-center text-muted-foreground">
                <MinusIcon className="w-3 h-3" />
                <span>0%</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Skill Progression</h2>
          <p className="text-muted-foreground">
            Track skill development and progression across roles and time periods
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button size="sm">
            Download Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <SkillProgressionFilterBar onFilterChange={handleFilterChange} />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Employees"
          value={filteredMetrics.totalEmployees.toString()}
          icon={<Users className="h-5 w-5" />}
          change={{ value: "+8.2%", type: "positive" }}
          subtitle="Tracked across all roles"
        />
        <MetricCard
          title="Avg Skill Rating"
          value={(filteredMetrics.avgSkillRating || 0).toFixed(1)}
          icon={<Award className="h-5 w-5" />}
          change={{ value: "+12.5%", type: "positive" }}
          subtitle="Out of 8.0 scale"
        />
        <MetricCard
          title="Advanced+ Employees"
          value={`${filteredMetrics.employeesAboveThreshold || 0}%`}
          icon={<Target className="h-5 w-5" />}
          change={{ value: "+15.3%", type: "positive" }}
          subtitle="Rating 6+ (Advanced)"
        />
        <MetricCard
          title="Progression Rate"
          value={`+${(filteredMetrics.progressionPercent || 0).toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          change={{ value: "+22.1%", type: "positive" }}
          subtitle="Vs previous period"
        />
      </div>

      {/* Progress Over Time Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
          <CardDescription>Skill rating progression across time periods</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 8]} />
              <Tooltip />
              <Legend />
              {paginatedSkills.map((skill, index) => (
                <Line 
                  key={skill}
                  type="monotone" 
                  dataKey={skill} 
                  stroke={`hsl(${index * 60}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Current vs Target Ratings Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current vs Target Ratings</CardTitle>
          <CardDescription>Comparison between current and target skill levels</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentVsTargetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis domain={[0, 8]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#22d3ee" name="Current Rating" />
              <Bar dataKey="target" fill="#f472b6" name="Target Rating" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skill vs Time Heatmap */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Skill vs Time Heatmap</CardTitle>
            <CardDescription>Average ratings across skills and time periods</CardDescription>
          </div>
          {totalFilteredPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, filteredData.length)} of {filteredData.length} entries
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPage + 1} of {totalFilteredPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalFilteredPages - 1, currentPage + 1))}
                disabled={currentPage === totalFilteredPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Y-axis label */}
            <div className="flex items-center gap-2">
              <div className="w-24"></div>
              <div className="flex gap-1 flex-1">
                <div className="text-xs font-medium text-muted-foreground text-center mb-2">
                  Time Periods (X-axis)
                </div>
              </div>
            </div>
            {/* Period headers */}
            <div className="flex items-center gap-2">
              <div className="w-24 text-xs font-medium text-muted-foreground">Skills (Y-axis)</div>
              <div className="flex gap-1 flex-1">
                {availablePeriods.map((period) => (
                  <div key={period} className="flex-1 text-xs font-medium text-center text-muted-foreground">
                    {period}
                  </div>
                ))}
              </div>
            </div>
            {heatmapData.map((skillRow) => (
              <div key={skillRow.skill} className="flex items-center gap-2">
                <div className="w-24 text-sm font-medium truncate">{skillRow.skill}</div>
                <div className="flex gap-1 flex-1">
                   {availablePeriods.map((period) => {
                     const value = skillRow[period] || 0;
                     let backgroundColor, textColor;
                     
                     if (value >= 1 && value < 3) {
                       // Red gradient for 1-3
                       const intensity = (value - 1) / 2 * 100; // 0-100%
                       backgroundColor = `hsl(0, 75%, ${Math.max(85 - intensity, 45)}%)`;
                       textColor = intensity > 50 ? 'white' : 'black';
                     } else if (value >= 3 && value < 5) {
                       // Amber gradient for 3-5  
                       const intensity = (value - 3) / 2 * 100; // 0-100%
                       backgroundColor = `hsl(45, 85%, ${Math.max(85 - intensity, 35)}%)`;
                       textColor = intensity > 50 ? 'black' : 'black';
                     } else if (value >= 5 && value <= 8) {
                       // Green gradient for 5-8
                       const intensity = (value - 5) / 3 * 100; // 0-100%
                       backgroundColor = `hsl(142, 76%, ${Math.max(85 - intensity, 25)}%)`;
                       textColor = intensity > 50 ? 'white' : 'black';
                     } else {
                       // Default for 0 or invalid values
                       backgroundColor = 'hsl(var(--muted))';
                       textColor = 'hsl(var(--muted-foreground))';
                     }
                     
                     return (
                        <div
                         key={period}
                         className="flex-1 h-8 rounded border border-border flex items-center justify-center text-xs font-medium"
                         style={{
                           backgroundColor,
                           color: textColor
                         }}
                         title={`${period}: ${value.toFixed(1)}`}
                       >
                         {value.toFixed(1)}
                       </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Summary Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Current Skill Gaps & Targets</CardTitle>
            <CardDescription>Skills requiring attention based on target ratings</CardDescription>
          </div>
          {Math.ceil(allBubbleData.length / 5) > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {currentPage * 5 + 1}-{Math.min((currentPage + 1) * 5, allBubbleData.length)} of {allBubbleData.length} skills
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPage + 1} of {Math.ceil(allBubbleData.length / 5)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(Math.ceil(allBubbleData.length / 5) - 1, currentPage + 1))}
                disabled={currentPage === Math.ceil(allBubbleData.length / 5) - 1}
              >
                Next
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allBubbleData.slice(currentPage * 5, (currentPage + 1) * 5).map((skill) => {
              const currentRating = skill.avgRating || 0;
              const targetRating = skill.targetRating || (6 + Math.random() * 2); // Use target from data or random 6-8
              const gap = Math.max(0, targetRating - currentRating);
              const progressPercentage = (currentRating / 8) * 100; // Scale to 8-point system
              const targetPercentage = (targetRating / 8) * 100;
              
              return (
                <div key={skill.skill} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="font-medium text-lg">{skill.skill}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Gap to Target</div>
                      <span className="text-lg font-bold text-red-500">
                        {gap > 0 ? '-' : ''}{gap.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Horizontal Gauge */}
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="w-full bg-muted rounded-full h-8">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-300"
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        >
                          <span className="text-white text-sm font-medium">
                            {currentRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      {/* Target marker */}
                      <div 
                        className="absolute top-0 w-1 h-8 bg-red-500 rounded-full"
                        style={{ left: `${Math.min(targetPercentage, 100)}%` }}
                        title={`Target: ${targetRating.toFixed(1)}`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>8</span>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                    <span>Employees: {skill.employeeCount || 0}</span>
                    <div className="flex items-center gap-1">
                      {(skill.changeVsLastQuarter || 0) > 0 ? (
                        <ArrowUpIcon className="w-4 h-4 text-green-600" />
                      ) : (skill.changeVsLastQuarter || 0) < 0 ? (
                        <ArrowDownIcon className="w-4 h-4 text-red-600" />
                      ) : (
                        <MinusIcon className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className={
                        (skill.changeVsLastQuarter || 0) > 0 ? "text-green-600" :
                        (skill.changeVsLastQuarter || 0) < 0 ? "text-red-600" :
                        "text-muted-foreground"
                      }>
                        {Math.abs((skill.changeVsLastQuarter || 0) * 100).toFixed(1)}% vs last quarter
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}