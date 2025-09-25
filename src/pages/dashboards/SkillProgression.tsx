import { useState } from "react";
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

  // Apply filters to data
  const filteredData = skillDistributionData.filter(item => {
    const roleMatch = filters.roles.length === 0 || filters.roles.includes(item.role);
    const skillMatch = filters.skills.length === 0 || filters.skills.includes(item.skill);
    const periodMatch = filters.timePeriod.length === 0 || filters.timePeriod.some(period => 
      item.timePeriod === period || 
      (period.includes('-Q') && item.timePeriod.startsWith(period)) ||
      (period.startsWith('FY') && !period.includes('-') && item.timePeriod.startsWith(period))
    );
    
    return roleMatch && skillMatch && periodMatch;
  });

  // Get unique values for dropdowns based on filtered data
  const availableRoles = filters.roles.length > 0 ? filters.roles : 
    Array.from(new Set(filteredData.map(d => d.role)));
  const availableSkills = filters.skills.length > 0 ? filters.skills :
    Array.from(new Set(filteredData.map(d => d.skill)));
  const availablePeriods = filters.timePeriod.length > 0 ? filters.timePeriod :
    Array.from(new Set(filteredData.map(d => d.timePeriod)));

  // Use first available role/skill for focused views
  const selectedRole = availableRoles[0] || "Data Scientist";
  const selectedSkill = availableSkills[0] || "SQL";

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Prepare line chart data for Progress Over Time
  const progressData = availablePeriods.map(period => {
    const periodData: any = { period };
    availableSkills.slice(0, 6).forEach(skill => { // Show top 6 skills
      const skillData = filteredData.find(
        item => item.timePeriod === period && item.skill === skill && availableRoles.includes(item.role)
      );
      periodData[skill] = skillData?.avgRating || 0;
    });
    return periodData;
  });

  // Prepare grouped bar chart data for Current vs Target Ratings
  const currentVsTargetData = availableSkills.slice(0, 6).map(skill => {
    const skillData = filteredData.filter(item => item.skill === skill && availableRoles.includes(item.role));
    const avgCurrent = skillData.length > 0 ? 
      skillData.reduce((sum, item) => sum + item.avgRating, 0) / skillData.length : 0;
    const target = Math.min(avgCurrent + Math.random() * 2 + 0.5, 10); // Simulate target slightly higher
    
    return {
      skill,
      current: avgCurrent,
      target: target
    };
  });

  // Prepare skill gaps data for horizontal progress bars
  const skillGapsData = availableSkills.slice(0, 6).map(skill => {
    const skillData = filteredData.filter(item => item.skill === skill && availableRoles.includes(item.role));
    const avgCurrent = skillData.length > 0 ? 
      skillData.reduce((sum, item) => sum + item.avgRating, 0) / skillData.length : 0;
    const target = Math.min(avgCurrent + Math.random() * 2 + 0.5, 10);
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

  // Generate dynamic data based on filters  
  const allHeatmapData = generateHeatmapData(filteredData);
  const allBubbleData = generateBubbleData(filteredData).map(item => ({
    ...item,
    color: item.changeVsLastQuarter > 0.2 ? priorityColors.positive :
           item.changeVsLastQuarter < -0.2 ? priorityColors.negative :
           priorityColors.neutral
  }));

  // Paginated data
  const heatmapData = allHeatmapData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const bubbleData = allBubbleData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  
  // Pagination info
  const totalHeatmapPages = Math.ceil(allHeatmapData.length / itemsPerPage);
  const totalBubblePages = Math.ceil(allBubbleData.length / itemsPerPage);

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

      {/* Main Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Progress Over Time Line Chart */}
        <ChartCard 
          title="Progress Over Time"
          subtitle="Skill rating progression across time periods"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              {availableSkills.slice(0, 6).map((skill, index) => (
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
        </ChartCard>

        {/* Current vs Target Ratings */}
        <ChartCard 
          title="Current vs Target Ratings"
          subtitle="Comparison between current and target skill levels"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentVsTargetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#22d3ee" name="Current Rating" />
              <Bar dataKey="target" fill="#f472b6" name="Target Rating" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Skill vs Time Heatmap */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Skill vs Time Heatmap</CardTitle>
            <CardDescription>Average ratings across skills and time periods</CardDescription>
          </div>
          {totalHeatmapPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPage + 1} of {totalHeatmapPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalHeatmapPages - 1, currentPage + 1))}
                disabled={currentPage === totalHeatmapPages - 1}
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

      {/* Skill Gaps & Priority Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Gaps & Priority Areas</CardTitle>
          <CardDescription>Priority areas requiring skill development focus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillGapsData.map((skill) => (
              <div key={skill.skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium min-w-[120px]">{skill.skill}</span>
                    <Badge 
                      variant={skill.priority === 'HIGH' ? 'destructive' : skill.priority === 'MEDIUM' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {skill.priority}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-red-500">
                      {skill.gap > 0 ? '-' : ''}{Math.abs(skill.gap).toFixed(1)}
                    </span>
                    <div className="text-xs text-muted-foreground">to target</div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-6">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${Math.min(skill.progress, 100)}%` }}
                    >
                      <span className="text-white text-xs font-medium">
                        {skill.current.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div 
                    className="absolute top-0 w-1 h-6 bg-red-400"
                    style={{ left: `${Math.min((skill.target / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Skill Gaps & Targets</CardTitle>
          <CardDescription>Skills requiring attention based on target ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allBubbleData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((skill) => (
              <div key={skill.skill} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{skill.skill}</div>
                   <Badge variant={skill.avgRating >= 6 ? "default" : skill.avgRating >= 4 ? "secondary" : "destructive"}>
                     {(skill.avgRating || 0).toFixed(1)}/8.0
                   </Badge>
                 </div>
                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
                   <span>Gap: {Math.max(0, 6 - (skill.avgRating || 0)).toFixed(1)}</span>
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
                       {Math.abs((skill.changeVsLastQuarter || 0) * 100).toFixed(1)}%
                     </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {Math.ceil(allBubbleData.length / itemsPerPage) > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentPage + 1} of {Math.ceil(allBubbleData.length / itemsPerPage)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(Math.ceil(allBubbleData.length / itemsPerPage) - 1, currentPage + 1))}
                disabled={currentPage === Math.ceil(allBubbleData.length / itemsPerPage) - 1}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}