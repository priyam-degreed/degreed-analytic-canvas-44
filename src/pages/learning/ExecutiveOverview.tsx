import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Download, TrendingUp, Clock, Users } from "lucide-react";
import { learningOverviewData } from "@/data/mockData";
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
  Cell
} from "recharts";

const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ExecutiveOverview() {
  const executiveMetrics = [
    {
      title: "Learning Completions (In Period)",
      value: learningOverviewData.completions.current,
      change: {
        value: `+${learningOverviewData.completions.change}`,
        type: "positive" as const,
        period: "vs previous"
      }
    },
    {
      title: "Total Learning Duration",
      value: `${learningOverviewData.learningDuration.total}h`,
      subtitle: "Across all roles and departments"
    },
    {
      title: "Active Learners",
      value: learningOverviewData.completionsByRole.reduce((sum, role) => sum + role.current, 0),
      subtitle: "Unique users with activity"
    },
    {
      title: "Top Performing Role", 
      value: "SDET",
      change: {
        value: "+67",
        type: "positive" as const,
        period: "completions"
      }
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Executive Overview</h1>
          <p className="text-muted-foreground mt-1">
            Review the high level outcomes of learning activities
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Aug 2025
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            All Roles
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Executive Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {executiveMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            subtitle={metric.subtitle}
          />
        ))}
      </div>

      {/* Main Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completions by Role */}
        <ChartCard
          title="How much learning was completed in this period?"
          subtitle="Learning completions by job role with period comparison"
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={learningOverviewData.completionsByRole}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="role" 
                stroke="#6b7280" 
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Current Period" />
              <Bar dataKey="previous" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Previous Period" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Learning Duration by Role */}
        <ChartCard
          title="How much time did people spend on learning?"
          subtitle="Learning duration estimate by role (Q3 2025)"
        >
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={learningOverviewData.learningDuration.byRole}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="hours"
              >
                {learningOverviewData.learningDuration.byRole.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}h`, 'Learning Duration']}
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {learningOverviewData.learningDuration.byRole.slice(0, 6).map((role, index) => (
              <div key={role.role} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate">{role.role}: {role.hours}h</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completions Comparison Table */}
        <ChartCard
          title="Learning Completions by Role"
          subtitle="Detailed comparison with previous period"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Job Role</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Current</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Previous</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                {learningOverviewData.completionsByRole.map((role) => (
                  <tr key={role.role} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3 font-medium">{role.role}</td>
                    <td className="p-3 text-right font-semibold">{role.current}</td>
                    <td className="p-3 text-right text-muted-foreground">{role.previous}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-1 rounded-md text-xs ${
                        role.change > 0 
                          ? 'bg-success/10 text-success' 
                          : role.change < 0 
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {role.change > 0 ? '+' : ''}{role.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Learning Duration Breakdown */}
        <ChartCard
          title="Learning Duration by Role"
          subtitle="Time spent on learning activities"
        >
          <div className="space-y-3">
            {learningOverviewData.learningDuration.byRole.map((role, index) => (
              <div key={role.role} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{role.role}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{role.hours}h</span>
                  </div>
                  <div className="w-20 bg-border rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${(role.hours / Math.max(...learningOverviewData.learningDuration.byRole.map(r => r.hours))) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Period Summary */}
      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Aug 2025 Learning Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {learningOverviewData.completions.current}
            </div>
            <div className="text-sm text-muted-foreground">Total Completions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              +{learningOverviewData.completions.change}
            </div>
            <div className="text-sm text-muted-foreground">vs Previous Period</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {learningOverviewData.learningDuration.total}h
            </div>
            <div className="text-sm text-muted-foreground">Total Learning Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {learningOverviewData.completionsByRole.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Job Roles</div>
          </div>
        </div>
      </div>
    </div>
  );
}