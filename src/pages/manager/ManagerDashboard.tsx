import { useState } from "react";
import { BarChart3, Users, Target, TrendingUp, Share, Download, FileText, Calendar } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { FilterBar } from "@/components/filters/FilterBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const COLORS = {
  primary: "#6366f1",
  accent: "#8b5cf6", 
  success: "#10b981",
  warning: "#f59e0b",
  muted: "#94a3b8"
};

// Sample data limited to manager's direct reports
const managerData = [
  { month: "Jan", completions: 45, activeUsers: 12 },
  { month: "Feb", completions: 52, activeUsers: 15 },
  { month: "Mar", completions: 38, activeUsers: 11 },
  { month: "Apr", completions: 61, activeUsers: 18 },
  { month: "May", completions: 55, activeUsers: 16 },
  { month: "Jun", completions: 67, activeUsers: 19 }
];

const skillsData = [
  { skill: "Data Analysis", users: 8 },
  { skill: "Project Management", users: 12 },
  { skill: "Communication", users: 15 },
  { skill: "Leadership", users: 6 },
  { skill: "Technical Writing", users: 9 }
];

export function ManagerDashboard() {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const quickStats = [
    {
      title: "Direct Reports Active",
      value: "19",
      change: {
        value: "+2",
        type: "positive" as const,
        period: "last month"
      },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Team Completions",
      value: "67",
      change: {
        value: "+12.5%",
        type: "positive" as const,
        period: "last month"
      },
      icon: <Target className="h-5 w-5" />
    },
    {
      title: "Learning Hours",
      value: "156h",
      change: {
        value: "+8.2%",
        type: "positive" as const,
        period: "this quarter"
      },
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Avg. Progress",
      value: "73%",
      change: {
        value: "+5%",
        type: "positive" as const,
        period: "improvement"
      },
      icon: <TrendingUp className="h-5 w-5" />
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header with Scope Indicator */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Scope: Direct Reports (Manager)
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            Learning analytics for your direct reports • Limited to your management scope
          </p>
        </div>

        {/* Action Buttons - Edit disabled, Share and Export active */}
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
            <FileText className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={() => setShareDialogOpen(true)}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Export PPT
          </Button>
        </div>
      </div>

      {/* Filters - constrained to manager scope */}
      <FilterBar />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <MetricCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Learning Completions Trend */}
        <ChartCard 
          title="Team Learning Activity" 
          subtitle="Monthly completions and active learners in your team"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={managerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Area
                type="monotone"
                dataKey="completions"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="activeUsers"
                stroke={COLORS.accent}
                fill={COLORS.accent}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Skills */}
        <ChartCard 
          title="Skills Adoption by Direct Reports" 
          subtitle="Most popular skills among your team members"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis 
                dataKey="skill" 
                type="category" 
                stroke="#64748b" 
                fontSize={12}
                width={120}
              />
              <Bar dataKey="users" fill={COLORS.primary} radius={[0, 4, 4, 0]}>
                {skillsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.primary} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* AI Insights & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <ChartCard title="Team Insights" subtitle="Analytics specific to your direct reports">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">📈 High Engagement Period</h4>
              <p className="text-sm text-blue-800">
                Your team shows 23% higher completion rates on Tuesdays and Wednesdays
              </p>
              <p className="text-xs text-blue-600 mt-2">Confidence: 87% • Impact: High</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">🎯 Skill Gap Opportunity</h4>
              <p className="text-sm text-green-800">
                3 team members could benefit from advanced project management training
              </p>
              <p className="text-xs text-green-600 mt-2">Confidence: 92% • Impact: Medium</p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-2">⚠️ Learning Velocity</h4>
              <p className="text-sm text-amber-800">
                Team completion rate decreased 8% this month - consider workload balance
              </p>
              <p className="text-xs text-amber-600 mt-2">Confidence: 78% • Impact: Medium</p>
            </div>
          </div>
        </ChartCard>

        {/* Quick Navigation */}
        <ChartCard title="Team Management" subtitle="Quick access to team-specific views">
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" className="justify-start h-auto p-4">
              <Users className="h-5 w-5 mr-3 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Individual Progress</div>
                <div className="text-sm text-muted-foreground">View each team member's learning journey</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <Target className="h-5 w-5 mr-3 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Team Goals</div>
                <div className="text-sm text-muted-foreground">Set and track learning objectives</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <BarChart3 className="h-5 w-5 mr-3 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Skills Matrix</div>
                <div className="text-sm text-muted-foreground">Team competency overview</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <TrendingUp className="h-5 w-5 mr-3 text-orange-600" />
              <div className="text-left">
                <div className="font-medium">Performance Trends</div>
                <div className="text-sm text-muted-foreground">Long-term team analytics</div>
              </div>
            </Button>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}