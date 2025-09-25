import { useState, useEffect, useMemo } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillProgressionFilterBar } from "@/components/filters/SkillProgressionFilterBar";
import { useFilters } from "@/contexts/FilterContext";
import { useFilteredData } from "@/hooks/useFilteredData";
import { 
  comprehensiveLearningData, 
  comprehensiveSkillRatings, 
  FILTER_OPTIONS 
} from '@/data/comprehensiveMockData';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  ComposedChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from "recharts";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Custom colors for rating levels
const ratingColors = {
  low: "#ef4444",      // red
  medium: "#f97316",   // orange  
  good: "#eab308",     // yellow
  high: "#22c55e",     // green
  excellent: "#8b5cf6" // purple
};

interface FilterState {
  roles: string[];
  skills: string[];
  timePeriod: string[];
  ratingLevels: string[];
  ratingTypes: string[];
}

export default function SkillProgression() {
  const { filters } = useFilters();
  
  // Use comprehensive filtered data
  const filteredSkillRatings = useFilteredData(comprehensiveSkillRatings, filters);
  const filteredLearningData = useFilteredData(comprehensiveLearningData, filters);
  
  console.log('SkillProgression - Filtered Data:', {
    skillRatings: filteredSkillRatings.length,
    learningData: filteredLearningData.length,
    appliedFilters: filters
  });

  // Local filter state for SkillProgressionFilterBar compatibility
  const [localFilters, setLocalFilters] = useState<FilterState>({
    roles: [],
    skills: [],
    timePeriod: [],
    ratingLevels: [],
    ratingTypes: []
  });

  // Calculate comprehensive metrics from filtered data
  const skillMetrics = useMemo(() => {
    const totalEmployees = new Set(filteredSkillRatings.map(r => `${r.roles[0]}-${r.groups[0]}`)).size;
    const avgRating = filteredSkillRatings.length > 0 
      ? filteredSkillRatings.reduce((sum, r) => sum + r.currentRating, 0) / filteredSkillRatings.length 
      : 0;
    const advancedEmployees = filteredSkillRatings.filter(r => r.currentRating >= 4.0).length;
    const progressionRate = filteredSkillRatings.filter(r => r.targetRating > r.currentRating).length;
    
    return {
      totalEmployees: Math.max(totalEmployees, 50),
      avgSkillRating: avgRating,
      employeesAboveThreshold: totalEmployees > 0 ? Math.floor((advancedEmployees / totalEmployees) * 100) : 75,
      progressionPercent: totalEmployees > 0 ? Math.floor((progressionRate / totalEmployees) * 100) : 65,
      skillGapToTarget: filteredSkillRatings.length > 0 
        ? filteredSkillRatings.reduce((sum, r) => sum + Math.max(0, r.targetRating - r.currentRating), 0) / filteredSkillRatings.length 
        : 0
    };
  }, [filteredSkillRatings]);

  // Prepare comprehensive data for charts from filtered results
  const chartData = useMemo(() => {
    // Skills vs Time data (monthly aggregation)
    const skillTimeData = filteredSkillRatings.reduce((acc: any, rating) => {
      const monthKey = rating.date.substring(0, 7); // YYYY-MM
      const key = `${rating.skill}-${monthKey}`;
      
      if (!acc[key]) {
        acc[key] = {
          skill: rating.skill,
          period: monthKey,
          avgRating: 0,
          count: 0,
          role: rating.roles[0] || 'Unknown'
        };
      }
      
      acc[key].avgRating = (acc[key].avgRating * acc[key].count + rating.currentRating) / (acc[key].count + 1);
      acc[key].count += 1;
      
      return acc;
    }, {});

    // Progress over time data - aggregated by month
    const progressTimeData = Object.values(
      filteredSkillRatings.reduce((acc: any, rating) => {
        const monthKey = rating.date.substring(0, 7);
        
        if (!acc[monthKey]) {
          acc[monthKey] = { period: monthKey };
        }
        
        // Add skill ratings to the period
        if (!acc[monthKey][rating.skill]) {
          acc[monthKey][rating.skill] = [];
        }
        acc[monthKey][rating.skill].push(rating.currentRating);
        
        return acc;
      }, {})
    ).map((periodData: any) => {
      // Calculate average ratings for each skill in this period
      const processed = { period: periodData.period };
      Object.keys(periodData).forEach(key => {
        if (key !== 'period' && Array.isArray(periodData[key])) {
          processed[key] = periodData[key].reduce((sum: number, val: number) => sum + val, 0) / periodData[key].length;
        }
      });
      return processed;
    }).sort((a, b) => a.period.localeCompare(b.period));

    // Current vs Target data
    const skillTargetData = Object.values(
      filteredSkillRatings.reduce((acc: any, rating) => {
        const skill = rating.skill;
        
        if (!acc[skill]) {
          acc[skill] = {
            skill,
            current: 0,
            target: 0,
            count: 0
          };
        }
        
        acc[skill].current = (acc[skill].current * acc[skill].count + rating.currentRating) / (acc[skill].count + 1);
        acc[skill].target = (acc[skill].target * acc[skill].count + rating.targetRating) / (acc[skill].count + 1);
        acc[skill].count += 1;
        
        return acc;
      }, {})
    ).slice(0, 15); // Limit to 15 skills for display

    // Skills by rating type data (mock for now, can be enhanced with real data structure)
    const skillRatingTypeData = FILTER_OPTIONS.skills.slice(0, 10).map(skill => {
      const skillRatings = filteredSkillRatings.filter(r => r.skill === skill);
      const avgCurrent = skillRatings.length > 0 
        ? skillRatings.reduce((sum, r) => sum + r.currentRating, 0) / skillRatings.length 
        : 3 + Math.random() * 2;
      
      return {
        skill,
        Self: +(avgCurrent + (Math.random() - 0.5) * 0.5).toFixed(1),
        Peer: +(avgCurrent + (Math.random() - 0.5) * 0.4).toFixed(1),
        Manager: +(avgCurrent + (Math.random() - 0.5) * 0.3).toFixed(1),
        Target: +(avgCurrent + 0.5 + Math.random() * 1.0).toFixed(1)
      };
    });

    // Heatmap data preparation
    const heatmapData = Object.values(skillTimeData).slice(0, 20).map((item: any) => ({
      skill: item.skill,
      period: item.period,
      rating: +item.avgRating.toFixed(1),
      role: item.role
    }));

    return {
      skillTimeData: Object.values(skillTimeData).slice(0, 50),
      skillTargetData,
      skillRatingTypeData,
      progressTimeData,
      heatmapData
    };
  }, [filteredSkillRatings]);

  // Pagination state - separate for each chart
  const [heatmapCurrentPage, setHeatmapCurrentPage] = useState(0);
  const [gapsCurrentPage, setGapsCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Reset pagination when filters change
  useEffect(() => {
    setHeatmapCurrentPage(0);
    setGapsCurrentPage(0);
  }, [filters]);

  // Prepare paginated data for charts
  const paginatedHeatmapData = chartData.heatmapData.slice(
    heatmapCurrentPage * itemsPerPage, 
    (heatmapCurrentPage + 1) * itemsPerPage
  );
  
  const paginatedTargetData = chartData.skillTargetData.slice(
    gapsCurrentPage * itemsPerPage, 
    (gapsCurrentPage + 1) * itemsPerPage
  );

  // Get top skills from progress data for line chart
  const topSkills = Object.keys(chartData.progressTimeData[0] || {})
    .filter(key => key !== 'period')
    .slice(0, 8); // Show top 8 skills

  // Pagination calculations
  const totalHeatmapPages = Math.ceil(chartData.heatmapData.length / itemsPerPage);
  const totalGapsPages = Math.ceil(chartData.skillTargetData.length / itemsPerPage);

  const handleFilterChange = (newFilters: FilterState) => {
    setLocalFilters(newFilters);
    // Note: This bridges the SkillProgressionFilterBar with our main filter system
    console.log('Local filter change:', newFilters);
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
      <SkillProgressionFilterBar filters={localFilters} onFilterChange={handleFilterChange} />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Employees"
          value={skillMetrics.totalEmployees.toString()}
          icon={<Users className="h-5 w-5" />}
          change={{ value: "+8.2%", type: "positive" }}
          subtitle="Tracked across all roles"
        />
        <MetricCard
          title="Avg Skill Rating"
          value={(skillMetrics.avgSkillRating || 0).toFixed(1)}
          icon={<Award className="h-5 w-5" />}
          change={{ value: "+12.5%", type: "positive" }}
          subtitle="Out of 5.0 scale"
        />
        <MetricCard
          title="Advanced+ Employees"
          value={`${skillMetrics.employeesAboveThreshold || 0}%`}
          icon={<Target className="h-5 w-5" />}
          change={{ value: "+15.3%", type: "positive" }}
          subtitle="Rating 4+ (Advanced)"
        />
        <MetricCard
          title="Progression Rate"
          value={`+${(skillMetrics.progressionPercent || 0).toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          change={{ value: "+22.1%", type: "positive" }}
          subtitle="Vs previous period"
        />
      </div>

      {/* Progress Over Time Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
          <CardDescription>Skill rating progression across time periods (Top {topSkills.length} skills)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.progressTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              {topSkills.map((skill, index) => (
                <Line 
                  key={skill}
                  type="monotone" 
                  dataKey={skill} 
                  stroke={`hsl(${index * 45}, 70%, 50%)`}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skills vs Rating Type Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Skills vs Rating Type</CardTitle>
          <CardDescription>Comparison of current vs target ratings with filtered data ({chartData.skillRatingTypeData.length} skills)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart 
              data={chartData.skillRatingTypeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="skill" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={12}
              />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Self" fill="#34d399" name="Self Rating" />
              <Bar dataKey="Peer" fill="#60a5fa" name="Peer Rating" />
              <Bar dataKey="Manager" fill="#fbbf24" name="Manager Rating" />
              <Line 
                type="monotone" 
                dataKey="Target" 
                stroke="#ef4444" 
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ fill: '#ef4444', r: 3 }}
                name="Target Level"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Current vs Target Ratings Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current vs Target Ratings</CardTitle>
          <CardDescription>Skill gaps analysis with filtered data ({chartData.skillTargetData.length} skills)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={paginatedTargetData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="skill" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={12}
              />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="hsl(var(--primary))" name="Current Rating" />
              <Bar dataKey="target" fill="hsl(var(--secondary))" name="Target Rating" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Pagination Controls for Target Data */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {gapsCurrentPage + 1} of {totalGapsPages} ({chartData.skillTargetData.length} total skills)
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGapsCurrentPage(Math.max(0, gapsCurrentPage - 1))}
                disabled={gapsCurrentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGapsCurrentPage(Math.min(totalGapsPages - 1, gapsCurrentPage + 1))}
                disabled={gapsCurrentPage === totalGapsPages - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill vs Time Heatmap */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Skill vs Time Heatmap</CardTitle>
            <CardDescription>Skill rating evolution over time periods - Page {heatmapCurrentPage + 1} of {totalHeatmapPages} ({chartData.heatmapData.length} total entries)</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHeatmapCurrentPage(Math.max(0, heatmapCurrentPage - 1))}
              disabled={heatmapCurrentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHeatmapCurrentPage(Math.min(totalHeatmapPages - 1, heatmapCurrentPage + 1))}
              disabled={heatmapCurrentPage === totalHeatmapPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paginatedHeatmapData.map((item, index) => {
              const rating = item.rating;
              let ratingColor = "#e5e7eb";
              let textColor = "#6b7280";
              
              if (rating >= 4.5) {
                ratingColor = ratingColors.excellent;
                textColor = "#ffffff";
              } else if (rating >= 4.0) {
                ratingColor = ratingColors.high;
                textColor = "#ffffff";
              } else if (rating >= 3.0) {
                ratingColor = ratingColors.good;
                textColor = "#ffffff";
              } else if (rating >= 2.0) {
                ratingColor = ratingColors.medium;
                textColor = "#ffffff";
              } else if (rating > 0) {
                ratingColor = ratingColors.low;
                textColor = "#ffffff";
              }
              
              return (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-32 font-medium text-sm truncate">
                    {item.skill}
                  </div>
                  <div className="w-24 text-sm text-muted-foreground">
                    {item.period}
                  </div>
                  <div 
                    className="w-16 h-8 rounded-md flex items-center justify-center text-xs font-medium"
                    style={{ 
                      backgroundColor: ratingColor, 
                      color: textColor 
                    }}
                    title={`Rating: ${rating}/5.0`}
                  >
                    {rating}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(rating / 5) * 100}%`,
                          backgroundColor: ratingColor
                        }}
                      />
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.role}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}