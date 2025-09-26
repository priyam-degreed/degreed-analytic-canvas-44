import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Download, TrendingUp, Users, Target, BookOpen, Share, Edit } from "lucide-react";
import { formatNumber, formatPercentage } from "@/lib/formatters";
import { 
  strategicOverviewData, 
  learningOverviewData, 
  engagementData, 
  aiInsightsData 
} from "@/data/mockData";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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

const COLORS = {
  primary: "#3b82f6",
  accent: "#06b6d4", 
  success: "#10b981",
  warning: "#f59e0b",
  muted: "#6b7280"
};

export default function Dashboard() {
  const quickStats = [
    {
      title: "Total Learning Completions",
      value: learningOverviewData.completions.current,
      change: {
        value: `+${learningOverviewData.completions.change}`,
        type: "positive" as const,
        period: "last month"
      },
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: "Active Skills",
      value: strategicOverviewData.totalSkills,
      subtitle: `${strategicOverviewData.totalUsers} total users`,
      icon: <Target className="h-5 w-5" />
    },
    {
      title: "Learning Hours",
      value: `${learningOverviewData.learningDuration.total}h`,
      change: {
        value: "+245h",
        type: "positive" as const,
        period: "last month"
      },
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: "User Engagement",
      value: "52%",
      subtitle: "Following skill plans",
      change: {
        value: "+15%",
        type: "positive" as const,
        period: "last quarter"
      },
      icon: <Users className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive view of learning, skills, and engagement metrics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PPT
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <MetricCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            subtitle={stat.subtitle}
            icon={stat.icon}
            className="animate-slide-in"
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Completions Trend */}
        <ChartCard
          title="Learning Completions Trend"
          subtitle="Monthly completion activity over time"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementData.monthlyCompletions}>
              <defs>
                <linearGradient id="completionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Area
                type="monotone"
                dataKey="completions"
                stroke={COLORS.primary}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#completionsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Skills Distribution */}
        <ChartCard
          title="Top Skills by User Count"
          subtitle="Most popular skills in the organization"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={strategicOverviewData.topSkills.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
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
              <Bar dataKey="users" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* AI Insights & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <ChartCard
          title="AI-Generated Insights"
          subtitle="Automated analytics discoveries"
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            {aiInsightsData.slice(0, 3).map((insight, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/30 transition-fast"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-success">
                        Confidence: {Math.round(insight.confidence * 100)}%
                      </span>
                      <span className={insight.impact === 'high' ? 'text-accent' : 'text-warning'}>
                        {insight.impact} impact
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Quick Navigation */}
        <ChartCard
          title="Quick Navigation"
          subtitle="Jump to detailed views"
        >
          <div className="space-y-3">
            <Link to="/overview/strategic">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Strategic Overview
              </Button>
            </Link>
            <Link to="/learning/executive">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Learning Analytics
              </Button>
            </Link>
            <Link to="/skills/adoption">
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Skills Analysis
              </Button>
            </Link>
            <Link to="/ai/insights">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </Link>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}