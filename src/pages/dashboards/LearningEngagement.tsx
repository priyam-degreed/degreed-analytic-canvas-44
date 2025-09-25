import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Clock, BookOpen, Play, Award, Target, Share, Edit, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { FilterBar } from "@/components/filters/FilterBar";
import { useFilters } from "@/contexts/FilterContext";
import { useFilteredData, useFilteredMetrics } from "@/hooks/useFilteredData";
import { useState, useMemo } from "react";
import { 
  comprehensiveLearningData, 
  comprehensiveSkillRatings, 
  comprehensiveTrendingTopics,
  aggregateDataByPeriod 
} from '@/data/comprehensiveMockData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8'];

export default function LearningEngagement() {
  const { filters } = useFilters();
  
  // Use comprehensive filtered data
  const filteredLearningData = useFilteredData(comprehensiveLearningData, filters);
  const filteredSkillRatings = useFilteredData(comprehensiveSkillRatings, filters);
  const filteredTrendingTopics = useFilteredData(comprehensiveTrendingTopics, filters);

  // Calculate aggregated metrics from filtered data
  const aggregatedMetrics = useMemo(() => {
    const totalLearners = filteredLearningData.reduce((sum, item) => sum + item.learners, 0);
    const totalCompletions = filteredLearningData.reduce((sum, item) => sum + item.completions, 0);
    const totalHours = filteredLearningData.reduce((sum, item) => sum + item.hours, 0);
    const totalActiveUsers = filteredLearningData.reduce((sum, item) => sum + item.activeUsers, 0);
    const avgEngagement = filteredLearningData.length > 0 
      ? filteredLearningData.reduce((sum, item) => sum + item.engagementRate, 0) / filteredLearningData.length 
      : 0;

    // Engagement trends from filtered data grouped by date
    const trendsByDate = filteredLearningData.reduce((acc: any, item) => {
      const key = item.date.substring(0, 7); // YYYY-MM format
      if (!acc[key]) {
        acc[key] = { date: key, completions: 0, activeUsers: 0, hours: 0 };
      }
      acc[key].completions += item.completions;
      acc[key].activeUsers += item.activeUsers;
      acc[key].hours += item.hours;
      return acc;
    }, {});

    const engagementTrends = Object.values(trendsByDate).sort((a: any, b: any) => 
      a.date.localeCompare(b.date)
    );

    return {
      totalLearners: Math.max(totalLearners, 0),
      totalCompletions: Math.max(totalCompletions, 0),
      totalHours: Math.max(totalHours, 0),
      totalActiveUsers: Math.max(totalActiveUsers, 0),
      avgEngagement: Math.max(avgEngagement, 0),
      engagementTrends
    };
  }, [filteredLearningData]);
  
  // Calculate current vs previous period comparison
  const currentVsPrevComparison = useMemo(() => {
    // Sort filtered data by date to get chronological order
    const sortedData = [...filteredLearningData].sort((a, b) => a.date.localeCompare(b.date));
    
    if (sortedData.length === 0) {
      return {
        current: { completions: 0, hours: 0, activeUsers: 0 },
        previous: { completions: 0, hours: 0, activeUsers: 0 },
        comparison: []
      };
    }

    // Split data into two halves (current vs previous period)
    const midPoint = Math.floor(sortedData.length / 2);
    const previousPeriod = sortedData.slice(0, midPoint);
    const currentPeriod = sortedData.slice(midPoint);

    // Aggregate totals for each period
    const currentTotals = currentPeriod.reduce((acc, item) => ({
      completions: acc.completions + item.completions,
      hours: acc.hours + item.hours,
      activeUsers: acc.activeUsers + item.activeUsers
    }), { completions: 0, hours: 0, activeUsers: 0 });

    const previousTotals = previousPeriod.reduce((acc, item) => ({
      completions: acc.completions + item.completions,
      hours: acc.hours + item.hours,
      activeUsers: acc.activeUsers + item.activeUsers
    }), { completions: 0, hours: 0, activeUsers: 0 });

    // Create comparison data for chart
    const comparison = [
      {
        metric: 'Completions',
        current: currentTotals.completions,
        previous: previousTotals.completions
      },
      {
        metric: 'Learning Hours',
        current: currentTotals.hours,
        previous: previousTotals.hours
      },
      {
        metric: 'Active Users',
        current: currentTotals.activeUsers,
        previous: previousTotals.activeUsers
      }
    ];

    return {
      current: currentTotals,
      previous: previousTotals,
      comparison
    };
  }, [filteredLearningData]);
  
  // Calculate filtered metrics from aggregated data (no longer need separate filtering)
  const metrics = {
    totalLearners: aggregatedMetrics.totalLearners || 15420,
    activeUsersThisWeek: aggregatedMetrics.totalActiveUsers || 8934,
    courseCompletions: aggregatedMetrics.totalCompletions || 3847,
    learningHours: aggregatedMetrics.totalHours || 12847,
    avgCompletionRate: Math.round(aggregatedMetrics.avgEngagement) || 75
  };

  // Job role data filtered by current filters
  const roleData = [
    { dept: "Engineering", hours: 8.5, learners: 1240, trend: 15 },
    { dept: "Product", hours: 6.8, learners: 340, trend: 8 },
    { dept: "Data Science", hours: 9.2, learners: 180, trend: 22 },
    { dept: "Marketing", hours: 4.3, learners: 290, trend: -3 }
  ].filter(role => {
    if (filters.roles.length === 0) return true;
    return filters.roles.some(selectedRole => 
      role.dept.toLowerCase().includes(selectedRole.toLowerCase()) ||
      selectedRole.toLowerCase().includes(role.dept.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Learning Engagement</h1>
        <p className="text-muted-foreground mt-1">
          Track learning activity, participation, and engagement across your organization
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar showRoles={true} showCustomAttribute={true} />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Active Learners"
          value={metrics.totalLearners.toLocaleString()}
          change={{ value: 15.3, type: "positive" }}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Active This Week"
          value={metrics.activeUsersThisWeek.toLocaleString()}
          change={{ value: 8.9, type: "positive" }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title="Course Completions"
          value={metrics.courseCompletions.toLocaleString()}
          change={{ value: 28.9, type: "positive" }}
          icon={<Award className="h-5 w-5" />}
        />
        <MetricCard
          title="Learning Hours"
          value={`${metrics.learningHours.toLocaleString()}h`}
          change={{ value: 12.4, type: "positive" }}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Current vs Previous Period Learning Completion */}
      <ChartCard
        title="How much learning was completed in this period? Current vs Prev"
        subtitle="Comparison of learning metrics between current and previous periods"
      >
        <div className="space-y-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={currentVsPrevComparison.comparison}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="current" fill="hsl(var(--primary))" name="Current Period" />
              <Bar dataKey="previous" fill="hsl(var(--secondary))" name="Previous Period" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {currentVsPrevComparison.current.completions.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Current Completions</div>
                <div className="text-xs text-green-600 mt-1">
                  {currentVsPrevComparison.previous.completions > 0 
                    ? `${((currentVsPrevComparison.current.completions - currentVsPrevComparison.previous.completions) / currentVsPrevComparison.previous.completions * 100).toFixed(1)}%`
                    : 'N/A'
                  } vs prev
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {currentVsPrevComparison.current.hours.toLocaleString()}h
                </div>
                <div className="text-sm text-muted-foreground">Current Hours</div>
                <div className="text-xs text-green-600 mt-1">
                  {currentVsPrevComparison.previous.hours > 0 
                    ? `${((currentVsPrevComparison.current.hours - currentVsPrevComparison.previous.hours) / currentVsPrevComparison.previous.hours * 100).toFixed(1)}%`
                    : 'N/A'
                  } vs prev
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {currentVsPrevComparison.current.activeUsers.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Current Active Users</div>
                <div className="text-xs text-green-600 mt-1">
                  {currentVsPrevComparison.previous.activeUsers > 0 
                    ? `${((currentVsPrevComparison.current.activeUsers - currentVsPrevComparison.previous.activeUsers) / currentVsPrevComparison.previous.activeUsers * 100).toFixed(1)}%`
                    : 'N/A'
                  } vs prev
                </div>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Engagement Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Learning Engagement Trends"
          subtitle={`Showing data for ${aggregatedMetrics.engagementTrends.length} periods`}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart 
              data={aggregatedMetrics.engagementTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Area type="monotone" dataKey="completions" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" />
              <Area type="monotone" dataKey="activeUsers" stackId="2" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Content Modality Performance"
          subtitle={`Showing filtered content performance`}
        >
          <div className="space-y-4">
            {/* Show content type performance from filtered data */}
            {Object.entries(
              filteredLearningData.reduce((acc: any, item) => {
                const key = item.contentType;
                if (!acc[key]) {
                  acc[key] = { type: key, usage: 0, completionRate: 0, avgRating: 0, count: 0 };
                }
                acc[key].usage += item.learners;
                acc[key].completionRate += item.engagementRate;
                acc[key].avgRating += item.avgRating;
                acc[key].count += 1;
                return acc;
              }, {})
            ).map(([key, modality]: [string, any], index) => {
              const avgCompletionRate = modality.completionRate / modality.count;
              const avgRating = modality.avgRating / modality.count;
              
              return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-medium">{modality.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{modality.usage.toLocaleString()} users</span>
                    <span>{Math.round(avgCompletionRate)}% completion</span>
                    <span>⭐ {avgRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, avgCompletionRate)}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Trending Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Trending Learning Topics"
            subtitle={`${filteredTrendingTopics.length} topics filtered`}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={filteredTrendingTopics}
                margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="topic" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="learners" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Engagement Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Monthly Active Learners</span>
                  <span className="text-sm text-muted-foreground">{Math.min(Math.round((metrics.activeUsersThisWeek / metrics.totalLearners) * 100), 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(Math.round((metrics.activeUsersThisWeek / metrics.totalLearners) * 100), 100)}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Course Completion Rate</span>
                  <span className="text-sm text-muted-foreground">{metrics.avgCompletionRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${metrics.avgCompletionRate}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Learning Hours Goal</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Learning Time</span>
                <span className="font-medium">4.2h/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Most Popular Format</span>
                <span className="font-medium">
                  Course (78%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Peak Learning Day</span>
                <span className="font-medium">Tuesday</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Mobile Usage</span>
                <span className="font-medium">43%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Learning Velocity */}
      <ChartCard
        title="Learning Velocity by Job Role"
        subtitle={`Average learning hours per employee - ${roleData.length} roles shown`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roleData.map((dept, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{dept.dept}</h4>
                <span className={`text-sm ${dept.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dept.trend > 0 ? '+' : ''}{dept.trend}%
                </span>
              </div>
              <div className="text-2xl font-bold text-primary">{dept.hours}h</div>
              <div className="text-sm text-muted-foreground">{dept.learners} learners</div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}