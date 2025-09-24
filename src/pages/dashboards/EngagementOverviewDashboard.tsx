import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Target, Heart, Clock, Award, Share, Edit, Download, Activity, Zap } from "lucide-react";
import { FilterBar } from "@/components/filters/FilterBar";
import { learningEngagementData } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

export default function EngagementOverviewDashboard() {
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d'];
  
  // Manager-level team data (10-20 direct reports)
  const teamEngagementData = {
    activeTeamMembers: 17,
    teamLearningHours: 68.4,
    avgHoursPerMember: 4.0,
    teamCompletions: 42,
    teamCompletionChange: 24.5,
    teamSatisfactionScore: 4.4,
    
    teamTrends: [
      { month: "Jul", completions: 8, hours: 32, activeUsers: 14 },
      { month: "Aug", completions: 12, hours: 48, activeUsers: 16 },
      { month: "Sep", completions: 15, hours: 58, activeUsers: 17 }
    ],
    
    teamContentUsage: [
      { type: "Articles", usage: 28, completionRate: 82, avgRating: 4.3 },
      { type: "Videos", usage: 24, completionRate: 88, avgRating: 4.6 },
      { type: "Pathways", usage: 15, completionRate: 73, avgRating: 4.2 },
      { type: "Assessments", usage: 12, completionRate: 95, avgRating: 4.1 },
      { type: "Podcasts", usage: 8, completionRate: 68, avgRating: 4.0 }
    ],
    
    teamSkillFocus: [
      { topic: "Leadership Skills", learners: 8, growth: 60 },
      { topic: "Project Management", learners: 6, growth: 33 },
      { topic: "Communication", learners: 5, growth: 25 },
      { topic: "Data Analysis", learners: 4, growth: 100 },
      { topic: "Cloud Computing", learners: 3, growth: 50 }
    ]
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Engagement Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor learner engagement and interaction patterns across the platform
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Team Members"
          value={teamEngagementData.activeTeamMembers.toString()}
          change={{ value: 6.2, type: "positive" }}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg Hours per Member"
          value={`${teamEngagementData.avgHoursPerMember.toFixed(1)}h`}
          change={{ value: 8.3, type: "positive" }}
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricCard
          title="Team Completions"
          value={teamEngagementData.teamCompletions.toString()}
          change={{ value: teamEngagementData.teamCompletionChange, type: "positive" }}
          icon={<Target className="h-5 w-5" />}
        />
        <MetricCard
          title="Team Satisfaction"
          value={`${teamEngagementData.teamSatisfactionScore}/5`}
          change={{ value: 4.8, type: "positive" }}
          icon={<Heart className="h-5 w-5" />}
        />
      </div>

      {/* Engagement Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Engagement Trends"
          subtitle="User activity and interaction patterns over time"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={teamEngagementData.teamTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Area
                type="monotone"
                dataKey="activeUsers"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                name="Active Users"
              />
              <Area
                type="monotone"
                dataKey="completions"
                stackId="2"
                stroke="hsl(var(--secondary))"
                fill="hsl(var(--secondary))"
                fillOpacity={0.3}
                name="Completions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Content Modality Usage"
          subtitle="Learning preferences and content type engagement"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamEngagementData.teamContentUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="type" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
                formatter={(value, name) => [
                  name === 'usage' ? [value, 'Total Usage'] : [value + '%', 'Completion Rate']
                ]}
              />
              <Bar dataKey="usage" fill="hsl(var(--primary))" name="usage" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Trending Topics Section */}
      <ChartCard
        title="Team Skill Focus Areas"
        subtitle="Skills your team is actively developing"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {teamEngagementData.teamSkillFocus.slice(0, 5).map((topic, index) => (
              <div key={topic.topic} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{topic.topic}</div>
                    <div className="text-sm text-muted-foreground">{topic.learners.toLocaleString()} learners</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+{topic.growth}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={teamEngagementData.teamContentUsage}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="usage"
              >
                {teamEngagementData.teamContentUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(teamEngagementData.teamContentUsage.reduce((acc, curr) => acc + curr.completionRate, 0) / teamEngagementData.teamContentUsage.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{teamEngagementData.teamLearningHours}</div>
                <div className="text-sm text-muted-foreground">Team Learning Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{teamEngagementData.activeTeamMembers}</div>
                <div className="text-sm text-muted-foreground">Total Team Members</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(teamEngagementData.teamContentUsage.reduce((acc, curr) => acc + curr.avgRating, 0) / teamEngagementData.teamContentUsage.length).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Average Content Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}