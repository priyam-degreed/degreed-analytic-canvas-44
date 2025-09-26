import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Download, ThumbsUp, ThumbsDown } from "lucide-react";
import { engagementData } from "@/data/mockData";
import { DrillDownDialog } from "@/components/dashboard/DrillDownDialog";
import { getLearningDrillDownData } from "@/data/learningDrillDownData";
import { useState } from "react";
import {
  LineChart,
  Line,
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

const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#84cc16", "#f97316"];

export default function EngagementOverview() {
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);

  const handleCardClick = (cardType: string) => {
    const data = getLearningDrillDownData(cardType);
    setDrillDownData({ additionalData: data });
    setIsDrillDownOpen(true);
  };

  const engagementMetrics = [
    {
      title: "Learning Completions",
      value: engagementData.monthlyCompletions[engagementData.monthlyCompletions.length - 1].completions,
      change: {
        value: "+87",
        type: "positive" as const,
        period: "vs last month"
      }
    },
    {
      title: "Learning Satisfaction",
      value: `${Math.round((engagementData.satisfaction.likes / engagementData.satisfaction.totalRatings) * 100)}%`,
      subtitle: `${engagementData.satisfaction.likes} likes, ${engagementData.satisfaction.dislikes} dislikes`
    },
    {
      title: "Total Learning Hours",
      value: `${engagementData.skillsDuration.reduce((sum, skill) => sum + skill.duration, 0)}h`,
      subtitle: "Across all skill categories"
    },
    {
      title: "Most Active Skill",
      value: "Unknown/General",
      subtitle: `${engagementData.skillsDuration[0].duration} hours logged`
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Engagement Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor the level of engagement in learning activities
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Aug 2025
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            All Activities
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {engagementMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            subtitle={metric.subtitle}
            onClick={() => handleCardClick(metric.title)}
          />
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Completions Trend */}
        <ChartCard
          title="How much learning was completed?"
          subtitle="Trend breakdown of learning completions over time"
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={engagementData.monthlyCompletions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [value, 'Completions']}
              />
              <Line
                type="monotone"
                dataKey="completions"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Skills Duration */}
        <ChartCard
          title="How much time did participants spend on different skills?"
          subtitle="Learning duration by skill category with change indicators"
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={engagementData.skillsDuration.slice(0, 6)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" fontSize={12} />
              <YAxis 
                dataKey="skill" 
                type="category" 
                stroke="#6b7280" 
                fontSize={10}
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [`${value}h`, 'Duration']}
              />
              <Bar 
                dataKey="duration" 
                fill="#06b6d4" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills Duration Table */}
        <ChartCard
          title="Learning Duration by Skills"
          subtitle="Detailed breakdown with period comparison"
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Skill Category</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Duration (h)</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Change</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Trend</th>
                </tr>
              </thead>
              <tbody>
                {engagementData.skillsDuration.map((skill, index) => (
                  <tr key={skill.skill} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-3 font-medium">{skill.skill}</td>
                    <td className="p-3 text-right font-semibold">{skill.duration}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-1 rounded-md text-xs ${
                        skill.change > 0 
                          ? 'bg-success/10 text-success' 
                          : skill.change < 0 
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {skill.change > 0 ? '+' : ''}{skill.change}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            skill.change > 0 ? 'bg-success' : skill.change < 0 ? 'bg-destructive' : 'bg-muted-foreground'
                          }`}
                          style={{ 
                            width: `${Math.min(Math.abs(skill.change / 200) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Satisfaction Analysis */}
        <ChartCard
          title="How satisfied are participants?"
          subtitle="User rating breakdown"
        >
          <div className="space-y-6">
            {/* Satisfaction Pie Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Likes', value: engagementData.satisfaction.likes, color: '#10b981' },
                    { name: 'Dislikes', value: engagementData.satisfaction.dislikes, color: '#ef4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Ratings']}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Satisfaction Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Likes</span>
                </div>
                <span className="font-bold text-success">{engagementData.satisfaction.likes}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Dislikes</span>
                </div>
                <span className="font-bold text-destructive">{engagementData.satisfaction.dislikes}</span>
              </div>

              <div className="text-center pt-3 border-t border-border">
                <div className="text-2xl font-bold text-primary">
                  {Math.round((engagementData.satisfaction.likes / engagementData.satisfaction.totalRatings) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Engagement Summary */}
      <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Engagement Summary - Aug 2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {engagementData.monthlyCompletions[engagementData.monthlyCompletions.length - 1].completions}
            </div>
            <div className="text-sm text-muted-foreground">Total Completions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {engagementData.skillsDuration.reduce((sum, skill) => sum + skill.duration, 0)}h
            </div>
            <div className="text-sm text-muted-foreground">Learning Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {Math.round((engagementData.satisfaction.likes / engagementData.satisfaction.totalRatings) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {engagementData.skillsDuration.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Skills</div>
          </div>
        </div>
      </div>

      {/* Drill Down Dialog */}
      <DrillDownDialog
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        data={drillDownData}
        onApplyFilter={() => {}}
        onViewDetails={() => {}}
      />
    </div>
  );
}