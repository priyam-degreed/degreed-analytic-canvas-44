import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Clock, BookOpen, Award, Target, Play, Calendar, BarChart3, Star } from "lucide-react";
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
import { LearningFilterBar } from "@/components/filters/LearningFilterBar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { 
  learningData, 
  filterLearningData, 
  generateEngagementTrends,
  generateContentPerformance,
  generatePopularSkills,
  learningMetrics
} from "@/data/learningData";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8'];

interface LearningFilters {
  roles: string[];
  contentTypes: string[];
  providers: string[];
  ratings: number[];
  periods: string[];
  skills: string[];
}

export default function LearningEngagement() {
  const [filters, setFilters] = useState<LearningFilters>({
    roles: [],
    contentTypes: [],
    providers: [],
    ratings: [],
    periods: [],
    skills: []
  });

  // Filter the data based on current filters
  const filteredData = filterLearningData(learningData, filters);
  
  // Generate dashboard data from filtered results
  const engagementTrends = generateEngagementTrends(filteredData);
  const contentPerformance = generateContentPerformance(filteredData);
  const popularSkills = generatePopularSkills(filteredData);

  // Calculate filtered metrics
  const metrics = {
    totalLearners: filteredData.length > 0 
      ? Math.floor(filteredData.reduce((sum, activity) => sum + activity.activeUsers, 0) / filteredData.length * 10)
      : Math.floor(learningMetrics.totalLearners),
    activeUsersThisWeek: filteredData.length > 0
      ? Math.floor(filteredData.reduce((sum, activity) => sum + activity.activeUsers, 0) / filteredData.length * 8)
      : Math.floor(learningMetrics.totalLearners * 0.6),
    courseCompletions: filteredData.reduce((sum, activity) => sum + activity.completions, 0) || 0,
    learningHours: Math.floor(filteredData.reduce((sum, activity) => sum + activity.learningHours, 0)) || 0,
    avgCompletionRate: filteredData.length > 0 
      ? Number((filteredData.reduce((sum, activity) => sum + activity.completionRate, 0) / filteredData.length).toFixed(1))
      : Number(learningMetrics.avgCompletionRate.toFixed(1)),
    avgRating: filteredData.length > 0
      ? Number((filteredData.reduce((sum, activity) => sum + activity.avgRating, 0) / filteredData.length).toFixed(1))
      : Number(learningMetrics.avgRating.toFixed(1))
  };

  // Top performing providers from filtered data
  const topProviders = filteredData.reduce((acc, activity) => {
    if (!acc[activity.provider]) {
      acc[activity.provider] = {
        provider: activity.provider,
        completions: 0,
        avgRating: 0,
        totalRating: 0,
        count: 0
      };
    }
    acc[activity.provider].completions += activity.completions;
    acc[activity.provider].totalRating += activity.avgRating;
    acc[activity.provider].count += 1;
    acc[activity.provider].avgRating = acc[activity.provider].totalRating / acc[activity.provider].count;
    return acc;
  }, {} as Record<string, any>);

  const sortedProviders = Object.values(topProviders)
    .sort((a: any, b: any) => b.completions - a.completions)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Learning Engagement Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Interactive dashboard tracking learning activities, participation, and engagement across your organization
        </p>
      </div>

      {/* Enhanced Filter Bar */}
      <LearningFilterBar 
        filters={filters} 
        onFiltersChange={setFilters} 
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Active Learners"
          value={metrics.totalLearners.toLocaleString()}
          change={{ value: 15.3, type: "positive" }}
          icon={<Users className="h-5 w-5" />}
          subtitle={`${filteredData.length} activities tracked`}
        />
        <MetricCard
          title="Course Completions"
          value={metrics.courseCompletions.toLocaleString()}
          change={{ value: 12.8, type: "positive" }}
          icon={<Award className="h-5 w-5" />}
          subtitle={`${metrics.avgCompletionRate}% avg completion rate`}
        />
        <MetricCard
          title="Learning Hours"
          value={`${metrics.learningHours.toLocaleString()}h`}
          change={{ value: 18.2, type: "positive" }}
          icon={<Clock className="h-5 w-5" />}
          subtitle="Total hours consumed"
        />
        <MetricCard
          title="Average Rating"
          value={`${metrics.avgRating}/5.0`}
          change={{ value: 5.4, type: "positive" }}
          icon={<Star className="h-5 w-5" />}
          subtitle="Content satisfaction"
        />
      </div>

      {/* Engagement Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Learning Engagement Trends
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Showing data for {engagementTrends.length} periods
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={engagementTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="completions" 
                  stackId="1" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stackId="2" 
                  stroke="hsl(var(--secondary))" 
                  fill="hsl(var(--secondary))" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Content Type Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {contentPerformance.length} content types tracked
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentPerformance.map((item, index) => (
                <div key={item.contentType} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                      />
                      <span className="font-medium">{item.contentType}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{item.completions.toLocaleString()} completions</span>
                      <span>{item.completionRate}% rate</span>
                      <span>⭐ {item.avgRating}</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(item.completionRate, 100)}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Skills and Top Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Popular Skills
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Top {popularSkills.length} skills by learner engagement
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularSkills}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="skill" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="learners" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Performing Providers
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ranked by total completions
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedProviders.map((provider: any, index) => (
              <div key={provider.provider} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{provider.provider}</div>
                  <div className="text-sm text-muted-foreground">
                    {provider.completions.toLocaleString()} completions
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{provider.avgRating.toFixed(1)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    #{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Learning Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Learning Activity Summary
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Filtered view showing {filteredData.length} activities
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {filteredData.filter(a => a.contentType === 'Course').length}
              </div>
              <div className="text-sm text-muted-foreground">Courses</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-secondary">
                {filteredData.filter(a => a.contentType === 'Article').length}
              </div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-accent">
                {filteredData.filter(a => a.contentType === 'Assessment').length}
              </div>
              <div className="text-sm text-muted-foreground">Assessments</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-500">
                {filteredData.filter(a => a.contentType === 'Event').length}
              </div>
              <div className="text-sm text-muted-foreground">Events</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}