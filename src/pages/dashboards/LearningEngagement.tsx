import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Clock, BookOpen, Play, Award, Target, Share, Edit, Download } from "lucide-react";
import { learningEngagementData } from "@/data/mockData";
import { FilterBar } from "@/components/filters/FilterBar";
import { useFilters } from "@/contexts/FilterContext";
import { useFilteredData, useFilteredMetrics } from "@/hooks/useFilteredData";
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
  
  // Filter the data based on current filters
  const filteredEngagementTrends = useFilteredData(learningEngagementData.engagementTrends, filters);
  const filteredContentModalities = useFilteredData(learningEngagementData.contentModalities, filters);
  const filteredTrendingTopics = useFilteredData(learningEngagementData.trendingTopics, filters);
  
  // Calculate filtered metrics
  const metrics = useFilteredMetrics(
    [...filteredEngagementTrends, ...filteredContentModalities, ...filteredTrendingTopics], 
    filters,
    (data) => {
      const totalCompletions = filteredEngagementTrends.reduce((sum, item) => sum + item.completions, 0);
      const totalHours = filteredEngagementTrends.reduce((sum, item) => sum + item.hours, 0);
      const totalActiveUsers = filteredEngagementTrends.reduce((sum, item) => sum + item.activeUsers, 0);
      const avgActiveUsers = filteredEngagementTrends.length > 0 ? Math.floor(totalActiveUsers / filteredEngagementTrends.length) : 0;
      
      const totalModalityUsage = filteredContentModalities.reduce((sum, item) => sum + item.usage, 0);
      const avgCompletionRate = filteredContentModalities.length > 0 
        ? filteredContentModalities.reduce((sum, item) => sum + item.completionRate, 0) / filteredContentModalities.length 
        : 0;
      
      return {
        totalLearners: filteredTrendingTopics.reduce((sum, topic) => sum + topic.learners, 0) || learningEngagementData.totalLearners,
        activeUsersThisWeek: avgActiveUsers || learningEngagementData.activeUsersThisWeek,
        courseCompletions: totalCompletions || learningEngagementData.courseCompletions.thisQuarter,
        learningHours: totalHours || learningEngagementData.learningHours.total,
        avgCompletionRate: Math.round(avgCompletionRate) || 75
      };
    }
  );

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
      <FilterBar showRoles={true} />

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
          change={{ value: learningEngagementData.courseCompletions.change, type: "positive" }}
          icon={<Award className="h-5 w-5" />}
        />
        <MetricCard
          title="Learning Hours"
          value={`${metrics.learningHours.toLocaleString()}h`}
          change={{ value: 12.4, type: "positive" }}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      {/* Engagement Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Learning Engagement Trends"
          subtitle={`Showing data for ${filteredEngagementTrends.length} periods`}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={filteredEngagementTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="completions" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" />
              <Area type="monotone" dataKey="activeUsers" stackId="2" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Content Modality Performance"
          subtitle={`${filteredContentModalities.length} content types filtered`}
        >
          <div className="space-y-4">
            {filteredContentModalities.map((modality, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-medium">{modality.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{modality.usage.toLocaleString()} users</span>
                    <span>{modality.completionRate}% completion</span>
                    <span>⭐ {modality.avgRating}</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${modality.completionRate}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            ))}
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
              <BarChart data={filteredTrendingTopics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="topic" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
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
                <span className="font-medium">{learningEngagementData.learningHours.avgPerLearner}h/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Most Popular Format</span>
                <span className="font-medium">
                  {filteredContentModalities.length > 0 
                    ? filteredContentModalities.sort((a, b) => b.completionRate - a.completionRate)[0].type 
                    : "Videos"} 
                  ({filteredContentModalities.length > 0 
                    ? filteredContentModalities.sort((a, b) => b.completionRate - a.completionRate)[0].completionRate 
                    : 85}%)
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