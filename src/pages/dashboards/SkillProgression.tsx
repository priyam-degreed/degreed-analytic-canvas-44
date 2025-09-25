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

  // Prepare stacked column chart data for selected role and skill
  const stackedData = filteredData
    .filter(item => item.role === selectedRole && item.skill === selectedSkill)
    .map(item => ({
      period: item.timePeriod,
      Beginner: item.beginner,
      Capable: item.capable,
      Intermediate: item.intermediate,
      Effective: item.effective,
      Experienced: item.experienced,
      Advanced: item.advanced,
      Distinguished: item.distinguished,
      Master: item.master
    }));

  // Prepare line chart data for skill progression
  const lineData = availablePeriods.map(period => {
    const periodData: any = { period };
    availableSkills.slice(0, 5).forEach(skill => { // Limit to 5 skills for readability
      const skillData = filteredData.find(
        item => item.timePeriod === period && item.skill === skill && availableRoles.includes(item.role)
      );
      periodData[skill] = skillData?.avgRating || 0;
    });
    return periodData;
  });

  // Generate dynamic data based on filters
  const heatmapData = generateHeatmapData(filteredData);
  const bubbleData = generateBubbleData(filteredData).map(item => ({
    ...item,
    color: item.changeVsLastQuarter > 0.2 ? priorityColors.positive :
           item.changeVsLastQuarter < -0.2 ? priorityColors.negative :
           priorityColors.neutral
  }));

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
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stacked Column Chart */}
        <ChartCard 
          title="Skill Distribution Over Time"
          subtitle={`Rating distribution for ${selectedRole} - SQL`}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Beginner" stackId="a" fill={ratingColors.beginner} />
              <Bar dataKey="Capable" stackId="a" fill={ratingColors.capable} />
              <Bar dataKey="Intermediate" stackId="a" fill={ratingColors.intermediate} />
              <Bar dataKey="Effective" stackId="a" fill={ratingColors.effective} />
              <Bar dataKey="Experienced" stackId="a" fill={ratingColors.experienced} />
              <Bar dataKey="Advanced" stackId="a" fill={ratingColors.advanced} />
              <Bar dataKey="Distinguished" stackId="a" fill={ratingColors.distinguished} />
              <Bar dataKey="Master" stackId="a" fill={ratingColors.master} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Line Chart */}
        <ChartCard 
          title="Skill Progression Score" 
          subtitle={`Average rating progression for ${selectedRole}`}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 8]} />
              <Tooltip />
              <Legend />
              {availableSkills.slice(0, 5).map((skill, index) => (
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
      </div>

      {/* Bottom Row - Heatmap and Priority View */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Skill vs Time Heatmap</CardTitle>
            <CardDescription>Average ratings across skills and time periods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {heatmapData.map((skillRow) => (
                <div key={skillRow.skill} className="flex items-center gap-2">
                  <div className="w-24 text-sm font-medium truncate">{skillRow.skill}</div>
                  <div className="flex gap-1 flex-1">
                    {availablePeriods.map((period) => {
                      const value = skillRow[period];
                      const intensity = Math.round((value - 2) / 4 * 100); // Scale 2-6 to 0-100%
                      return (
                         <div
                           key={period}
                           className="flex-1 h-8 rounded border border-border flex items-center justify-center text-xs font-medium"
                           style={{
                             backgroundColor: `hsl(142, 76%, ${Math.max(85 - intensity, 20)}%)`,
                             color: intensity > 50 ? 'white' : 'black'
                           }}
                           title={`${period}: ${(value || 0).toFixed(1)}`}
                         >
                           {(value || 0).toFixed(1)}
                         </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority View - Bubble Chart */}
        <ChartCard 
          title="Skill Investment Priorities" 
          subtitle="Bubble size = employee count, color = change vs last quarter"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={bubbleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="importance" 
                domain={[0, 10]}
                name="Skill Importance"
                type="number"
              />
              <YAxis 
                dataKey="avgRating" 
                domain={[0, 8]}
                name="Average Rating"
                type="number"
              />
              <Tooltip content={<CustomBubbleTooltip />} />
              <Scatter name="Skills" dataKey="employeeCount">
                {bubbleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Skills Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Skill Gaps & Targets</CardTitle>
          <CardDescription>Skills requiring attention based on target ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bubbleData.slice(0, 10).map((skill) => (
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
        </CardContent>
      </Card>
    </div>
  );
}