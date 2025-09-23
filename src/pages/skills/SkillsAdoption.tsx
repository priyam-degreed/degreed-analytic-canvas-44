import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Download, Target, Users, TrendingUp } from "lucide-react";
import { skillsAdoptionData } from "@/data/mockData";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function SkillsAdoption() {
  const adoptionMetrics = [
    {
      title: "Users Following Skill Plans",
      value: "52%",
      change: {
        value: "+15%",
        type: "positive" as const,
        period: "vs last quarter"
      },
      subtitle: "Percentage engagement increase"
    },
    {
      title: "Endorsed Skill Plans",
      value: skillsAdoptionData.endorsedSkills.skillPlans,
      subtitle: "Active skill development paths"
    },
    {
      title: "Total Skills Available",
      value: skillsAdoptionData.endorsedSkills.totalSkills,
      subtitle: "In skill library"
    },
    {
      title: "Users with Focus Skills",
      value: skillsAdoptionData.skillFollowing.focusSkills,
      change: {
        value: "+89",
        type: "positive" as const,
        period: "this month"
      }
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Explore Skills Adoption</h1>
          <p className="text-muted-foreground mt-1">
            Explore adoption and impact of skills features within Degreed
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Sep 2025
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            All Skills
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Adoption Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adoptionMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            subtitle={metric.subtitle}
          />
        ))}
      </div>

      {/* Main Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Plan Engagement Trend */}
        <ChartCard
          title="Are users engaging with our skill plans?"
          subtitle="Percentage of users following a skill plan over time"
        >
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={skillsAdoptionData.skillPlanEngagement}>
              <defs>
                <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12} 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}%`, 'Engagement']}
              />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#engagementGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Skills Development Status */}
        <ChartCard
          title="How are users developing their skills?"
          subtitle="Users following skills vs users with focus skills"
        >
          <div className="space-y-6">
            {/* Following Skills */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Users Following at Least One Skill</span>
                <span className="text-lg font-bold text-primary">
                  {skillsAdoptionData.skillFollowing.usersFollowing.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-3">
                <div 
                  className="h-3 bg-primary rounded-full"
                  style={{ 
                    width: `${(skillsAdoptionData.skillFollowing.usersFollowing / skillsAdoptionData.skillFollowing.totalUsers) * 100}%` 
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((skillsAdoptionData.skillFollowing.usersFollowing / skillsAdoptionData.skillFollowing.totalUsers) * 100)}% of total users
              </div>
            </div>

            {/* Focus Skills */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Users with at Least One Focus Skill</span>
                <span className="text-lg font-bold text-accent">
                  {skillsAdoptionData.skillFollowing.focusSkills.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-3">
                <div 
                  className="h-3 bg-accent rounded-full"
                  style={{ 
                    width: `${(skillsAdoptionData.skillFollowing.focusSkills / skillsAdoptionData.skillFollowing.totalUsers) * 100}%` 
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((skillsAdoptionData.skillFollowing.focusSkills / skillsAdoptionData.skillFollowing.totalUsers) * 100)}% of total users
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-xl font-bold text-success">
                  {skillsAdoptionData.skillFollowing.totalUsers.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-warning">
                  {Math.round((skillsAdoptionData.skillFollowing.usersFollowing / skillsAdoptionData.skillFollowing.totalUsers) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Adoption Rate</div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Endorsed Skills Analysis */}
      <ChartCard
        title="Are users developing skills that are endorsed?"
        subtitle="Analysis of endorsed skill plans and skill development patterns"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Endorsed Skills Summary */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Endorsed Skills Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                <span className="text-sm font-medium">Endorsed Skill Plans</span>
                <span className="text-xl font-bold text-primary">
                  {skillsAdoptionData.endorsedSkills.skillPlans}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
                <span className="text-sm font-medium">Total Skills</span>
                <span className="text-xl font-bold text-accent">
                  {skillsAdoptionData.endorsedSkills.totalSkills}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-success/5 rounded-lg">
                <span className="text-sm font-medium">Endorsement Rate</span>
                <span className="text-xl font-bold text-success">
                  {Math.round((skillsAdoptionData.endorsedSkills.skillPlans / skillsAdoptionData.endorsedSkills.totalSkills) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Skills Development Insights */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Development Insights</h4>
            <div className="space-y-3">
              <div className="p-3 border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Most Popular Skills</div>
                <div className="font-medium">Leadership, Data Analytics, Python</div>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Emerging Skills</div>
                <div className="font-medium">Cloud Computing, AI/ML, Cybersecurity</div>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Skills Gap Areas</div>
                <div className="font-medium">Advanced Analytics, Digital Marketing</div>
              </div>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Adoption Summary */}
      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Skills Adoption Summary - Sep 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">52%</div>
            <div className="text-sm text-muted-foreground">User Engagement Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {skillsAdoptionData.endorsedSkills.skillPlans}
            </div>
            <div className="text-sm text-muted-foreground">Active Skill Plans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {skillsAdoptionData.skillFollowing.usersFollowing.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Active Learners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {skillsAdoptionData.skillFollowing.focusSkills}
            </div>
            <div className="text-sm text-muted-foreground">Focus Skills Active</div>
          </div>
        </div>
      </div>
    </div>
  );
}