import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Download, TrendingUp, Users, Target } from "lucide-react";
import { strategicOverviewData } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter
} from "recharts";

const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function StrategicOverview() {
  const periodMetrics = [
    {
      title: "Total Skills in System",
      value: strategicOverviewData.totalSkills,
      subtitle: "Active skills being tracked"
    },
    {
      title: "Total Users with Skills",
      value: strategicOverviewData.totalUsers.toLocaleString(),
      subtitle: "Across all skill categories"
    },
    {
      title: "Top Skill Users",
      value: strategicOverviewData.topSkills[0].users,
      subtitle: `${strategicOverviewData.topSkills[0].name} leads`
    },
    {
      title: "Expert Level Skills",
      value: strategicOverviewData.expertSkills.length,
      subtitle: "Skills with expert ratings"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quarterly Strategic Overview</h1>
          <p className="text-muted-foreground mt-1">
            Build workforce skills for current and future priorities on a quarterly basis
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Q3 2025
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            All Job Roles
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {periodMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            subtitle={metric.subtitle}
          />
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills Chart */}
        <ChartCard
          title="What are the top skills within the business?"
          subtitle="Skills users have on their profile with distribution of self ratings"
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={strategicOverviewData.topSkills}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280" 
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#6b7280" fontSize={12} label={{ value: 'Users', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [value, 'Users']}
              />
              <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Skills Expertise Distribution */}
        <ChartCard
          title="Where is expertise concentrated in the business?"
          subtitle="Skills with the most expert ratings"
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={strategicOverviewData.expertSkills} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#6b7280" 
                fontSize={11}
                width={120}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [value, 'Expert Ratings']}
              />
              <Bar dataKey="expertRatings" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Skills Analysis Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skills Table */}
        <ChartCard
          title="Skills Users Have on Profile"
          subtitle="Detailed breakdown with self-rating levels"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium text-muted-foreground">Skill</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Users</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {strategicOverviewData.topSkills.slice(0, 8).map((skill, index) => (
                  <tr key={skill.name} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-2 font-medium">{skill.name}</td>
                    <td className="p-2 text-right">{skill.users}</td>
                    <td className="p-2 text-right">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                        {skill.selfRating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Expert Skills Table */}
        <ChartCard
          title="Skills with Most Expert Ratings"
          subtitle="Areas of concentrated expertise"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium text-muted-foreground">Endorsed Skill</th>
                  <th className="text-right p-2 font-medium text-muted-foreground">Expert Ratings</th>
                </tr>
              </thead>
              <tbody>
                {strategicOverviewData.expertSkills.map((skill, index) => (
                  <tr key={skill.name} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-2 font-medium">{skill.name}</td>
                    <td className="p-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div 
                          className="h-2 bg-accent rounded-full"
                          style={{ width: `${(skill.expertRatings / 45) * 60}px` }}
                        />
                        <span>{skill.expertRatings}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Q3 2025 Skills Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">{strategicOverviewData.totalSkills}</div>
            <div className="text-sm text-muted-foreground">Total Active Skills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">{strategicOverviewData.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Users with Skills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {strategicOverviewData.expertSkills.reduce((sum, skill) => sum + skill.expertRatings, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Expert Ratings</div>
          </div>
        </div>
      </div>
    </div>
  );
}